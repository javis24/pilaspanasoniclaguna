import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const product = await prisma.products.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        categories: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          ok: false,
          message: "Producto no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      product,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener producto",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
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

    const { id } = await params;
    const body = await request.json();

    const product = await prisma.products.update({
      where: {
        id: Number(id),
      },
      data: {
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
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Producto actualizado correctamente",
      product,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al actualizar producto",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
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

    const { id } = await params;

    await prisma.products.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "No se pudo eliminar el producto. Puede tener pedidos relacionados.",
      },
      { status: 500 }
    );
  }
}