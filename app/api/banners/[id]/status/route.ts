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

    const newStatus = banner.status === "activo" ? "inactivo" : "activo";

    const updatedBanner = await prisma.banners.update({
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
      banner: updatedBanner,
    });
  } catch (error) {
    console.error("Error al cambiar estado del banner:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al cambiar estado del banner",
      },
      { status: 500 }
    );
  }
}