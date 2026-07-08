import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      where: {
        status: "activo",
        featured: true,
      },
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
    console.error("Error al obtener productos destacados:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener productos destacados",
      },
      { status: 500 }
    );
  }
}