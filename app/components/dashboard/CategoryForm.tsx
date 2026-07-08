"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";

type CategoryFormData = {
  id?: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  status: string | null;
};

type Props = {
  category?: CategoryFormData;
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

export default function CategoryForm({ category }: Props) {
  const router = useRouter();
  const isEditing = Boolean(category?.id);

  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || "",
    status: category?.status || "activo",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        image: form.image
          ? form.image.startsWith("/") || form.image.startsWith("http")
            ? form.image
            : `/${form.image}`
          : null,
        status: form.status,
      };

      const url = isEditing
        ? `/api/categories/${category?.id}`
        : "/api/categories";

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
        setError(data.message || "No se pudo guardar la categoría");
        return;
      }

      router.push("/dashboard/categorias");
      router.refresh();
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Información de la categoría
        </h2>

        <div className="mt-6 grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nombre de categoría
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              placeholder="Pilas Alcalinas"
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
              placeholder="pilas-alcalinas"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              placeholder="Descripción de la categoría..."
            />
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Publicación</h2>

          <div className="mt-6 space-y-5">
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Ruta de imagen
              </label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className="text-black w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="/images/categories/alcalinas.png"
              />

              <p className="mt-2 text-xs text-slate-500">
                Más adelante conectamos carga de imágenes con Vercel Blob.
              </p>
            </div>
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
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {loading ? "Guardando..." : "Guardar categoría"}
        </button>
      </aside>
    </form>
  );
}