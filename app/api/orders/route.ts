import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { getCurrentAdmin } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

type CartItem = {
  id: number;
  quantity: number;
};

const paymentMethods = new Set([
  "whatsapp",
  "efectivo",
  "transferencia",
]);

class InventoryConflictError extends Error {
  constructor(productName: string) {
    super(
      `El producto "${productName}" ya no está disponible o no tiene stock suficiente`
    );
    this.name = "InventoryConflictError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      ok: false,
      message,
    },
    { status }
  );
}

export async function GET() {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return errorResponse("No autorizado", 401);
    }

    const orders = await prisma.orders.findMany({
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
        users: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      total: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error al obtener pedidos:", error);

    return errorResponse("Error al obtener pedidos", 500);
  }
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse(
        "El cuerpo de la solicitud no contiene JSON válido",
        400
      );
    }

    if (!isRecord(body)) {
      return errorResponse("Los datos del pedido no son válidos", 400);
    }

    const customerName = getText(body.customerName);
    const customerEmail = getText(body.customerEmail);
    const customerPhone = getText(body.customerPhone);
    const shippingAddress = getText(body.shippingAddress);
    const paymentMethod = getText(body.paymentMethod) || "whatsapp";

    if (!customerName || !customerPhone || !shippingAddress) {
      return errorResponse(
        "Nombre, teléfono y dirección son obligatorios",
        400
      );
    }

    if (
      customerName.length > 255 ||
      customerEmail.length > 255 ||
      customerPhone.length > 255 ||
      paymentMethod.length > 255
    ) {
      return errorResponse(
        "Uno o más datos del cliente son demasiado largos",
        400
      );
    }

    if (!paymentMethods.has(paymentMethod)) {
      return errorResponse("El método de pago no es válido", 400);
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return errorResponse("El carrito está vacío", 400);
    }

    const cartItems: CartItem[] = [];

    for (const item of body.items) {
      if (
        !isRecord(item) ||
        typeof item.id !== "number" ||
        !Number.isSafeInteger(item.id) ||
        item.id <= 0 ||
        typeof item.quantity !== "number" ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return errorResponse(
          "Cada producto debe tener un ID y una cantidad entera mayor que cero",
          400
        );
      }

      cartItems.push({
        id: item.id,
        quantity: item.quantity,
      });
    }

    const productIds = cartItems.map((item) => item.id);
    const uniqueProductIds = new Set(productIds);

    if (uniqueProductIds.size !== productIds.length) {
      return errorResponse("El carrito contiene productos repetidos", 400);
    }

    const products = await prisma.products.findMany({
      where: {
        id: {
          in: productIds,
        },
        status: "activo",
      },
      select: {
        id: true,
        name: true,
        price: true,
        discountPrice: true,
      },
    });

    if (products.length !== productIds.length) {
      return errorResponse(
        "Uno o más productos no existen o están inactivos",
        400
      );
    }

    const productsById = new Map(
      products.map((product) => [product.id, product])
    );

    const calculatedItems = cartItems
      .map((item) => {
        const product = productsById.get(item.id);

        if (!product) {
          return null;
        }

        const price = product.discountPrice ?? product.price;

        return {
          product,
          quantity: item.quantity,
          price,
          subtotal: price.mul(item.quantity),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.product.id - b.product.id);

    if (calculatedItems.length !== cartItems.length) {
      return errorResponse("Producto no encontrado", 400);
    }

    if (
      calculatedItems.some(
        (item) =>
          !Number.isFinite(item.price.toNumber()) || item.price.isNegative()
      )
    ) {
      return errorResponse(
        "Uno o más productos tienen un precio no válido",
        400
      );
    }

    const total = calculatedItems.reduce(
      (sum, item) => sum.plus(item.subtotal),
      new Prisma.Decimal(0)
    );
    const now = new Date();

    const fullOrder = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.orders.create({
        data: {
          uuid: uuidv4(),
          customerName,
          customerEmail: customerEmail || null,
          customerPhone,
          shippingAddress,
          total,
          status: "pendiente",
          paymentStatus: "pendiente",
          paymentMethod,
          createdAt: now,
          updatedAt: now,
        },
      });

      for (const item of calculatedItems) {
        const stockUpdate = await tx.products.updateMany({
          where: {
            id: item.product.id,
            status: "activo",
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
            updatedAt: now,
          },
        });

        if (stockUpdate.count !== 1) {
          throw new InventoryConflictError(item.product.name);
        }

        await tx.order_items.create({
          data: {
            uuid: uuidv4(),
            orderId: createdOrder.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
            createdAt: now,
            updatedAt: now,
          },
        });
      }

      return tx.orders.findUniqueOrThrow({
        where: {
          id: createdOrder.id,
        },
        include: {
          order_items: {
            include: {
              products: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Pedido creado correctamente",
        order: fullOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof InventoryConflictError) {
      return errorResponse(error.message, 409);
    }

    console.error("Error al crear pedido:", error);

    return errorResponse("Error al crear pedido", 500);
  }
}