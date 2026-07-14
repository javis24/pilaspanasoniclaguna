import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Package, AlertTriangle } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import DeleteProductButton from "@/app/components/dashboard/DeleteProductButton";
import ToggleProductStatusButton from "@/app/components/dashboard/ToggleProductStatusButton";

type ProductModel = {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  price: unknown;
  stock: number;
  image: string | null;
  status: "activo" | "inactivo" | null;
  createdAt: Date;
  categories: {
    id: number;
    name: string;
  } | null;
};

function getImageSrc(image: string | null) {
  if (!image) return null;

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

export default async function ProductosPage() {
  const products = (await prisma.products.findMany({
    include: {
      categories: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as ProductModel[];

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product: ProductModel) => product.status === "activo"
  ).length;

  const lowStockProducts = products.filter(
    (product: ProductModel) => product.stock <= 5
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
          <p className="mt-2 text-slate-500">
            Administra el catálogo de pilas Panasonic.
          </p>
        </div>

        <Link
          href="/dashboard/productos/nuevo"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Nuevo producto
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total productos
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalProducts}
              </h2>
            </div>

            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <Package size={26} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Productos activos
          </p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {activeProducts}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Bajo stock</p>
              <h2 className="mt-2 text-3xl font-bold text-orange-600">
                {lowStockProducts}
              </h2>
            </div>

            <div className="rounded-2xl bg-orange-50 p-3 text-orange-600">
              <AlertTriangle size={26} />
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Catálogo de productos
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {products.map((product: ProductModel) => {
                const imageSrc = getImageSrc(product.image);

                return (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                              sizes="56px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package size={22} className="text-slate-400" />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {product.sku || "Sin SKU"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {product.categories?.name || "Sin categoría"}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ${Number(product.price).toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.stock <= 5
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock} piezas
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.status === "activo"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.status || "inactivo"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <ToggleProductStatusButton
                          productId={product.id}
                          currentStatus={product.status || "activo"}
                        />

                        <Link
                          href={`/dashboard/productos/${product.id}/editar`}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <Pencil size={15} />
                          Editar
                        </Link>

                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No hay productos registrados.
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