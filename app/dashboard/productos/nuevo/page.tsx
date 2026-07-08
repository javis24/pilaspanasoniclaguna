import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import ProductForm from "@/app/components/dashboard/ProductForm";

export default async function NuevoProductoPage() {
  const categories = await prisma.categories.findMany({
    where: {
      status: "activo",
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/productos"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Volver a productos
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">
          Nuevo producto
        </h1>
        <p className="mt-2 text-slate-500">
          Agrega un nuevo producto al catálogo.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}