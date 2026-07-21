import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentAdmin } from "@/app/lib/auth";

export const runtime = "nodejs";

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

    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json(
        {
          ok: false,
          message: "No se recibió ninguna imagen",
        },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Formato no permitido. Usa JPG, PNG o WEBP.",
        },
        { status: 400 }
      );
    }

    // Recomendado para evitar "Request Entity Too Large"
    const maxSize = 4 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          ok: false,
          message: "La imagen no debe pesar más de 4 MB.",
        },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop() || "jpg";
    const cleanFolder = folder || "uploads";

    const fileName = `${cleanFolder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const blob = await put(fileName, file, {
      access: "public",
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al subir imagen",
      },
      { status: 500 }
    );
  }
}