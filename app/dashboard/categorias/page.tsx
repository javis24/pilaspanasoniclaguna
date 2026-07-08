import Link from "next/link";
import { FolderTree, Pencil, Plus, Tags } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import DeleteCategoryButton from "@/app/components/dashboard/DeleteCategoryButton";
import ToggleCategoryStatusButton from "@/app/components/dashboard/ToggleCategoryStatusButton";

export default async function CategoriasPage() {
  const categories = await prisma.categories.findMany({
    include: {
      products: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const totalCategories = categories.length;
  const activeCategories = categories.filter(
    (category) => category.status === "activo"
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categorías</h1>
          <p className="mt-2 text-slate-500">
            Organiza los productos de la tienda por categorías.
          </p>
        </div>

        <Link
          href="/dashboard/categorias/nueva"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Nueva categoría
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total categorías
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalCategories}
              </h2>
            </div>

            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <Tags size={26} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Categorías activas
          </p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {activeCategories}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Productos relacionados
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {categories.reduce(
              (total, category) => total + category.products.length,
              0
            )}
          </h2>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Listado de categorías
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Productos</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FolderTree size={22} />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {category.name}
                        </p>
                        <p className="line-clamp-1 text-xs text-slate-500">
                          {category.description || "Sin descripción"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {category.slug}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {category.products.length} productos
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        category.status === "activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {new Date(category.createdAt).toLocaleDateString("es-MX")}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <ToggleCategoryStatusButton
                        categoryId={category.id}
                        currentStatus={category.status || "activo"}
                      />

                      <Link
                        href={`/dashboard/categorias/${category.id}/editar`}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Pencil size={15} />
                        Editar
                      </Link>

                      <DeleteCategoryButton categoryId={category.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-500"
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