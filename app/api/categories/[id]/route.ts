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

    const category = await prisma.categories.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          ok: false,
          message: "Categoría no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      category,
    });
  } catch (error) {
    console.error("Error al obtener categoría:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener categoría",
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

    if (!body.name || !body.slug) {
      return NextResponse.json(
        {
          ok: false,
          message: "Nombre y slug son obligatorios",
        },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.categories.findFirst({
      where: {
        slug: body.slug,
        NOT: {
          id: Number(id),
        },
      },
    });

    if (existingSlug) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe otra categoría con ese slug",
        },
        { status: 400 }
      );
    }

    const category = await prisma.categories.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image: body.image || null,
        status: body.status || "activo",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Categoría actualizada correctamente",
      category,
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al actualizar categoría",
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

    const productsCount = await prisma.products.count({
      where: {
        categoryId: Number(id),
      },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "No puedes eliminar esta categoría porque tiene productos relacionados. Puedes inactivarla.",
        },
        { status: 400 }
      );
    }

    await prisma.categories.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Categoría eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al eliminar categoría",
      },
      { status: 500 }
    );
  }
}