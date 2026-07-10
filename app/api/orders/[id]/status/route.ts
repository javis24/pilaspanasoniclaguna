import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { ok: false, message: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const allowedStatus = [
      "pendiente",
      "pagado",
      "preparando",
      "enviado",
      "entregado",
      "cancelado",
    ];

    const allowedPaymentStatus = ["pendiente", "pagado", "fallido"];

    if (body.status && !allowedStatus.includes(body.status)) {
      return NextResponse.json(
        { ok: false, message: "Estatus de pedido inválido" },
        { status: 400 }
      );
    }

    if (
      body.paymentStatus &&
      !allowedPaymentStatus.includes(body.paymentStatus)
    ) {
      return NextResponse.json(
        { ok: false, message: "Estatus de pago inválido" },
        { status: 400 }
      );
    }

    const order = await prisma.orders.update({
      where: {
        id: Number(id),
      },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
        updatedAt: new Date(),
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Pedido actualizado correctamente",
      order,
    });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);

    return NextResponse.json(
      { ok: false, message: "Error al actualizar pedido" },
      { status: 500 }
    );
  }
}