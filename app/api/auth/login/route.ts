import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { createAdminToken, setAdminCookie } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          ok: false,
          message: "Correo y contraseña son obligatorios",
        },
        { status: 400 }
      );
    }

    const admin = await prisma.users.findFirst({
      where: {
        email,
        role: "admin",
        status: "activo",
      },
    });

    if (!admin) {
      return NextResponse.json(
        {
          ok: false,
          message: "Credenciales incorrectas",
        },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          ok: false,
          message: "Credenciales incorrectas",
        },
        { status: 401 }
      );
    }

    const token = await createAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: "admin",
    });

    await setAdminCookie(token);

    return NextResponse.json({
      ok: true,
      message: "Inicio de sesión correcto",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al iniciar sesión",
      },
      { status: 500 }
    );
  }
}