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

    const banner = await prisma.banners.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!banner) {
      return NextResponse.json(
        {
          ok: false,
          message: "Banner no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      banner,
    });
  } catch (error) {
    console.error("Error al obtener banner:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener banner",
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

    if (!body.title) {
      return NextResponse.json(
        {
          ok: false,
          message: "El título es obligatorio",
        },
        { status: 400 }
      );
    }

    const banner = await prisma.banners.update({
      where: {
        id: Number(id),
      },
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        image: body.image || null,
        buttonText: body.buttonText || null,
        buttonUrl: body.buttonUrl || null,
        position: Number(body.position || 1),
        status: body.status || "activo",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Banner actualizado correctamente",
      banner,
    });
  } catch (error) {
    console.error("Error al actualizar banner:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al actualizar banner",
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

    await prisma.banners.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Banner eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar banner:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al eliminar banner",
      },
      { status: 500 }
    );
  }
}