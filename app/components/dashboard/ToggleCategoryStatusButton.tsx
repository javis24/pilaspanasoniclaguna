"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  categoryId: number;
  currentStatus: string;
};

export default function ToggleCategoryStatusButton({
  categoryId,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);

    try {
      const response = await fetch(`/api/categories/${categoryId}/status`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "No se pudo cambiar el estado");
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
      onClick={handleToggle}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
    >
      {currentStatus === "activo" ? <EyeOff size={15} /> : <Eye size={15} />}
      {loading ? "..." : currentStatus === "activo" ? "Ocultar" : "Activar"}
    </button>
  );
}