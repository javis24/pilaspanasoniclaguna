import "dotenv/config";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../app/lib/prisma";

async function main() {
  const email = "admin@pilaspanasoniclaguna.com";
  const password = "AdminPilas";

  const existingAdmin = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    console.log("El administrador ya existe:", email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const now = new Date();

  const admin = await prisma.users.create({
    data: {
      uuid: uuidv4(),
      name: "Administrador",
      email,
      password: hashedPassword,
      role: "admin",
      status: "activo",
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log("Administrador creado correctamente:");
  console.log("Email:", admin.email);
  console.log("Password:", password);
}

main()
  .catch((error) => {
    console.error("Error al crear administrador:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });