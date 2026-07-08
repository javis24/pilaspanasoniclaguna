import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const banners = await prisma.banners.findMany({
      where: {
        status: "activo",
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json({
      ok: true,
      total: banners.length,
      banners,
    });
  } catch (error) {
    console.error("Error al obtener banners:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener banners",
      },
      { status: 500 }
    );
  }
}