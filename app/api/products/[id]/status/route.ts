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

    const product = await prisma.products.findUnique({
      where: {
        id: Number(id),
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

    const newStatus = product.status === "activo" ? "inactivo" : "activo";

    const updatedProduct = await prisma.products.update({
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
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error al cambiar estado del producto:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al cambiar estado del producto",
      },
      { status: 500 }
    );
  }
}