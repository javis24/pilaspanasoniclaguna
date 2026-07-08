import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/app/components/dashboard/CategoryForm";

export default function NuevaCategoriaPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/categorias"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Volver a categorías
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">Nueva categoría</h1>
        <p className="mt-2 text-slate-500">
          Agrega una nueva categoría para organizar tus productos.
        </p>
      </div>

      <CategoryForm />
    </div>
  );
}