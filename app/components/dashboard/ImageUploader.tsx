"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";

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
    try {
      setError("");

      const file = event.target.files?.[0];

      if (!file) return;

      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", folder);

      setIsUploading(true);

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

  function removeImage() {
    onChange("");
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-slate-700">
        {label}
      </label>

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="relative h-48 w-full">
            <Image
              src={value}
              alt="Imagen subida"
              fill
              className="object-contain"
              sizes="400px"
            />
          </div>

          <button
            type="button"
            onClick={removeImage}
            className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white shadow hover:bg-red-700"
          >
            <X size={16} />
          </button>

          <p className="mt-3 break-all text-xs text-slate-500">{value}</p>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-500 hover:bg-blue-50">
          {isUploading ? (
            <Loader2 className="animate-spin text-blue-700" size={32} />
          ) : (
            <Upload className="text-blue-700" size={32} />
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