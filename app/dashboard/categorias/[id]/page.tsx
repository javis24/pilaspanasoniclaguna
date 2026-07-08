import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import CategoryForm from "@/app/components/dashboard/CategoryForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarCategoriaPage({ params }: Props) {
  const { id } = await params;

  const category = await prisma.categories.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!category) {
    notFound();
  }

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

        <h1 className="text-3xl font-bold text-slate-900">Editar categoría</h1>
        <p className="mt-2 text-slate-500">
          Modifica la información de la categoría seleccionada.
        </p>
      </div>

      <CategoryForm
        category={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          status: category.status,
        }}
      />
    </div>
  );
}