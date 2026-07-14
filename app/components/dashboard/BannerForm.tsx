"use client";

import Image from "next/image";
import { ImageIcon, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUploader from "@/app/components/dashboard/ImageUploader";

type BannerFormData = {
  id?: number;
  title: string;
  subtitle: string | null;
  image: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  position: number | null;
  status: string | null;
};

type Props = {
  banner?: BannerFormData;
};

function getImageSrc(image: string | null) {
  if (!image) return null;

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

export default function BannerForm({ banner }: Props) {
  const router = useRouter();
  const isEditing = Boolean(banner?.id);

  const [form, setForm] = useState({
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    image: banner?.image || "",
    buttonText: banner?.buttonText || "",
    buttonUrl: banner?.buttonUrl || "/productos",
    position: banner?.position ? String(banner.position) : "1",
    status: banner?.status || "activo",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

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
        title: form.title,
        subtitle: form.subtitle || null,
        image: form.image
          ? form.image.startsWith("/") || form.image.startsWith("http")
            ? form.image
            : `/${form.image}`
          : null,
        buttonText: form.buttonText || null,
        buttonUrl: form.buttonUrl || null,
        position: Number(form.position || 1),
        status: form.status,
      };

      const url = isEditing ? `/api/banners/${banner?.id}` : "/api/banners";

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
        setError(data.message || "No se pudo guardar el banner");
        return;
      }

      router.push("/dashboard/banners");
      router.refresh();
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Información del banner
          </h2>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Título
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="Energía confiable para tu hogar"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Subtítulo
              </label>
              <textarea
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="Compra pilas Panasonic alcalinas, litio y recargables."
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Texto del botón
                </label>
                <input
                  name="buttonText"
                  value={form.buttonText}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Comprar ahora"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  URL del botón
                </label>
                <input
                  name="buttonUrl"
                  value={form.buttonUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="/productos"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Vista previa</h2>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <div className="relative h-48">
              {getImageSrc(form.image) ? (
                <Image
                  src={getImageSrc(form.image)!}
                  alt={form.title || "Banner"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-slate-500">
                    <ImageIcon className="mx-auto mb-2" size={38} />
                    <p className="text-sm">Sin imagen</p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />

              <div className="absolute left-5 top-5 max-w-[230px]">
                <h3 className="text-xl font-black text-slate-950">
                  {form.title || "Título del banner"}
                </h3>

                {form.subtitle && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {form.subtitle}
                  </p>
                )}

                {form.buttonText && (
                  <span className="mt-4 inline-block rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white">
                    {form.buttonText}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Ruta de imagen
              </label>
              <ImageUploader
  label="Imagen del banner"
  value={form.image}
  folder="banners"
  onChange={(url) =>
    setForm((prev) => ({
      ...prev,
      image: url,
    }))
  }
/>

              <p className="mt-2 text-xs text-slate-500">
                Por ahora usa imágenes dentro de public/images/banners.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Posición
              </label>
              <input
                type="number"
                name="position"
                value={form.position}
                onChange={handleChange}
                min={1}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Posición 1 será el banner principal. 2, 3 y 4 serán banners laterales.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Estado
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
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
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Guardando..." : "Guardar banner"}
        </button>
      </aside>
    </form>
  );
}