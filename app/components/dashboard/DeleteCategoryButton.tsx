"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  categoryId: number;
};

export default function DeleteCategoryButton({ categoryId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta categoría?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "No se pudo eliminar la categoría");
        return;
      }

      router.refresh();
    } catch {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
    >
      <Trash2 size={15} />
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  );
}