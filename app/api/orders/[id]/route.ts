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
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { ok: false, message: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await prisma.orders.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
        users: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { ok: false, message: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      order,
    });
  } catch (error) {
    console.error("Error al obtener pedido:", error);

    return NextResponse.json(
      { ok: false, message: "Error al obtener pedido" },
      { status: 500 }
    );
  }
}