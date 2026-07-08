import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentAdmin } from "@/app/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      include: {
        products: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      ok: true,
      total: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener categorías",
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

    if (!body.name || !body.slug) {
      return NextResponse.json(
        {
          ok: false,
          message: "Nombre y slug son obligatorios",
        },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.categories.findUnique({
      where: {
        slug: body.slug,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una categoría con ese slug",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    const category = await prisma.categories.create({
      data: {
        uuid: uuidv4(),
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image: body.image || null,
        status: body.status || "activo",
        createdAt: now,
        updatedAt: now,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Categoría creada correctamente",
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear categoría:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al crear categoría",
      },
      { status: 500 }
    );
  }
}