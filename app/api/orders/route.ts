import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/auth";
import { v4 as uuidv4 } from "uuid";

type CartItem = {
  id: number;
  quantity: number;
  price: number;
};

type ProductModel = {
  id: number;
  name: string;
  price: unknown;
  discountPrice: unknown | null;
  stock: number;
};

type TransactionClient = {
  orders: typeof prisma.orders;
  order_items: typeof prisma.order_items;
  products: typeof prisma.products;
};

type CalculatedItem = {
  product: ProductModel;
  quantity: number;
  price: number;
  subtotal: number;
};

export async function GET() {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          ok: false,
          message: "No autorizado",
        },
        { status: 401 }
      );
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

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener pedidos",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      items,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress) {
      return NextResponse.json(
        {
          ok: false,
          message: "Nombre, teléfono y dirección son obligatorios",
        },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El carrito está vacío",
        },
        { status: 400 }
      );
    }

    const cartItems = items as CartItem[];

    const productIds = cartItems.map((item: CartItem) => Number(item.id));

    const products = (await prisma.products.findMany({
      where: {
        id: {
          in: productIds,
        },
        status: "activo",
      },
    })) as ProductModel[];

    if (products.length !== productIds.length) {
      return NextResponse.json(
        {
          ok: false,
          message: "Uno o más productos no existen o están inactivos",
        },
        { status: 400 }
      );
    }

    for (const item of cartItems) {
      const product = products.find(
        (p: ProductModel) => p.id === Number(item.id)
      );

      if (!product) {
        return NextResponse.json(
          {
            ok: false,
            message: "Producto no encontrado",
          },
          { status: 400 }
        );
      }

      if (Number(item.quantity) > product.stock) {
        return NextResponse.json(
          {
            ok: false,
            message: `No hay stock suficiente para: ${product.name}`,
          },
          { status: 400 }
        );
      }
    }

    const calculatedItems: CalculatedItem[] = cartItems.map(
      (item: CartItem) => {
        const product = products.find(
          (p: ProductModel) => p.id === Number(item.id)
        )!;

        const realPrice = product.discountPrice
          ? Number(product.discountPrice)
          : Number(product.price);

        const quantity = Number(item.quantity);
        const subtotal = realPrice * quantity;

        return {
          product,
          quantity,
          price: realPrice,
          subtotal,
        };
      }
    );

    const total = calculatedItems.reduce(
      (sum: number, item: CalculatedItem) => sum + item.subtotal,
      0
    );

    const now = new Date();

    const order = await prisma.$transaction(
      async (tx: TransactionClient) => {
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
            paymentMethod: paymentMethod || "whatsapp",
            createdAt: now,
            updatedAt: now,
          },
        });

        for (const item of calculatedItems) {
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

          await tx.products.update({
            where: {
              id: item.product.id,
            },
            data: {
              stock: item.product.stock - item.quantity,
              updatedAt: now,
            },
          });
        }

        return createdOrder;
      }
    );

    const fullOrder = await prisma.orders.findUnique({
      where: {
        id: order.id,
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
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
    console.error("Error al crear pedido:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al crear pedido",
      },
      { status: 500 }
    );
  }
}