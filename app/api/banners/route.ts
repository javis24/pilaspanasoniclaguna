import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const banners = await prisma.banners.findMany({
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

export async function POST(request: Request) {
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

    const now = new Date();

    const banner = await prisma.banners.create({
      data: {
        uuid: uuidv4(),
        title: body.title,
        subtitle: body.subtitle || null,
        image: body.image || null,
        buttonText: body.buttonText || null,
        buttonUrl: body.buttonUrl || null,
        position: Number(body.position || 1),
        status: body.status || "activo",
        createdAt: now,
        updatedAt: now,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Banner creado correctamente",
        banner,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear banner:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al crear banner",
      },
      { status: 500 }
    );
  }
}