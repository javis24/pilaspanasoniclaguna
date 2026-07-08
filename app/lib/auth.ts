import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/app/lib/prisma";

const COOKIE_NAME = "admin_token";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET no está configurado en .env");
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminToken(payload: {
  id: number;
  email: string;
  name: string;
  role: string;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    if (payload.role !== "admin") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyAdminToken(token);

  if (!payload?.id) {
    return null;
  }

  const admin = await prisma.users.findFirst({
    where: {
      id: Number(payload.id),
      role: "admin",
      status: "activo",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return admin;
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function removeAdminCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}