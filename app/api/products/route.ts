import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      include: {
        categories: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      total: products.length,
      products,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener productos",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();

    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json(
        {
          ok: false,
          message: "Nombre, slug y precio son obligatorios",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    const product = await prisma.products.create({
      data: {
        uuid: uuidv4(),
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        price: body.price,
        discountPrice: body.discountPrice || null,
        stock: Number(body.stock || 0),
        sku: body.sku || null,
        image: body.image || null,
        status: body.status || "activo",
        featured: Boolean(body.featured || false),
        categoryId: body.categoryId ? Number(body.categoryId) : null,
        createdAt: now,
        updatedAt: now,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Producto creado correctamente",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear producto:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al crear producto",
      },
      { status: 500 }
    );
  }
}