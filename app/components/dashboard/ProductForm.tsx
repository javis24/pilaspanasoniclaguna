"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";

type Category = {
  id: number;
  name: string;
};

type ProductFormData = {
  id?: number;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  discountPrice: string | number | null;
  stock: number;
  sku: string | null;
  image: string | null;
  status: string | null;
  featured: boolean | null;
  categoryId: number | null;
};

type Props = {
  categories: Category[];
  product?: ProductFormData;
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEditing = Boolean(product?.id);

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price ? String(product.price) : "",
    discountPrice: product?.discountPrice ? String(product.discountPrice) : "",
    stock: product?.stock || 0,
    sku: product?.sku || "",
    image: product?.image || "",
    status: product?.status || "activo",
    featured: Boolean(product?.featured || false),
    categoryId: product?.categoryId ? String(product.categoryId) : "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: prev.slug ? prev.slug : generateSlug(value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock),
        sku: form.sku || null,
        image: form.image
        ? form.image.startsWith("/") || form.image.startsWith("http")
          ? form.image
          : `/${form.image}`
        : null,
        status: form.status,
        featured: form.featured,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      };

      const url = isEditing
        ? `/api/products/${product?.id}`
        : "/api/products";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "No se pudo guardar el producto");
        return;
      }

      router.push("/dashboard/productos");
      router.refresh();
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  function getImageSrc(image: string | null) {
  if (!image) return null;

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 xl:grid-cols-[1fr_360px]"
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Información del producto
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nombre del producto
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="Panasonic Evolta AA 4 piezas"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug
              </label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="panasonic-evolta-aa-4-piezas"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                SKU
              </label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="LR6EGL-4B"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="Descripción del producto..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Precio e inventario
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="89.00"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Precio descuento
              </label>
              <input
                type="number"
                step="0.01"
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="79.00"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="50"
              />
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Publicación
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Categoría
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Sin categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Estado
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleCheckbox}
                className="h-4 w-4"
              />
              Producto destacado
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Imagen</h2>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Ruta de imagen
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              placeholder="/images/products/producto.png"
            />

            <p className="mt-2 text-xs text-slate-500">
              Por ahora se guarda la ruta de imagen. Después podemos agregar
              carga directa de archivos.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Guardando..." : "Guardar producto"}
        </button>
      </aside>
    </form>
  );
}