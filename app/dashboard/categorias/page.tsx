import Link from "next/link";
import { Plus, Folder, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import DeleteCategoryButton from "@/app/components/dashboard/DeleteCategoryButton";
import ToggleCategoryStatusButton from "@/app/components/dashboard/ToggleCategoryStatusButton";

type CategoryModel = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  status: "activo" | "inactivo" | null;
  createdAt: Date;
  updatedAt: Date;
  products?: {
    id: number;
  }[];
};

export default async function CategoriasPage() {
  const categories = (await prisma.categories.findMany({
    include: {
      products: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as CategoryModel[];

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category: CategoryModel) => category.status === "activo"
  ).length;

  const inactiveCategories = categories.filter(
    (category: CategoryModel) => category.status === "inactivo"
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Categorías
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Administra las categorías de productos de la tienda.
          </p>
        </div>

        <Link
          href="/dashboard/categorias/nueva"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
        >
          <Plus size={18} />
          Nueva categoría
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total categorías</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                {totalCategories}
              </h2>
            </div>

            <Folder className="text-blue-700" size={32} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Activas</p>
              <h2 className="mt-2 text-3xl font-black text-green-600">
                {activeCategories}
              </h2>
            </div>

            <Eye className="text-green-600" size={32} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Inactivas</p>
              <h2 className="mt-2 text-3xl font-black text-red-600">
                {inactiveCategories}
              </h2>
            </div>

            <EyeOff className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-black text-slate-950">
            Lista de categorías
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Categoría</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4">Productos</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {categories.map((category: CategoryModel) => (
                <tr key={category.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">
                      {category.name}
                    </div>

                    <div className="mt-1 max-w-md truncate text-xs text-slate-500">
                      {category.description || "Sin descripción"}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {category.slug}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-900">
                    {category.products?.length || 0}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        category.status === "activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/categorias/${category.id}/editar`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                      >
                        Editar
                      </Link>

                      <ToggleCategoryStatusButton
                        categoryId={category.id}
                        currentStatus={category.status || "inactivo"}
                      />

                      <DeleteCategoryButton categoryId={category.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No hay categorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}