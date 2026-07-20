"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
};

export default function ImageUploader({
  value,
  onChange,
  folder = "uploads",
  label = "Imagen",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setError("");
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Error al subir imagen");
      }

      onChange(data.url);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al subir imagen"
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
      <label className="block text-sm font-bold text-slate-900">
        {label}
      </label>

      {value ? (
        <div className="space-y-4">
          <div className="relative h-52 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <Image
              src={value}
              alt="Imagen subida"
              fill
              className="object-contain p-3"
              sizes="400px"
            />
          </div>

          <p className="break-all text-xs text-slate-500">{value}</p>

          <div className="flex gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
              {isUploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Upload size={16} />
              )}
              Cambiar imagen

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              <X size={16} />
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:border-blue-500 hover:bg-blue-50">
          {isUploading ? (
            <Loader2 className="animate-spin text-blue-700" size={34} />
          ) : (
            <Upload className="text-blue-700" size={34} />
          )}

          <span className="mt-3 text-sm font-bold text-slate-800">
            {isUploading ? "Subiendo imagen..." : "Seleccionar imagen"}
          </span>

          <span className="mt-1 text-xs text-slate-500">
            JPG, PNG o WEBP. Máximo 5 MB.
          </span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
    </div>
  );
}