import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(_request: Request, { params }: Params) {
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

    const category = await prisma.categories.findUnique({
      where: {
        id: Number(id),
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

    const newStatus = category.status === "activo" ? "inactivo" : "activo";

    const updatedCategory = await prisma.categories.update({
      where: {
        id: Number(id),
      },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Estado actualizado correctamente",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error al cambiar estado:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al cambiar estado de la categoría",
      },
      { status: 500 }
    );
  }
}