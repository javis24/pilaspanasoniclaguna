"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  orderId: number;
  currentStatus: string;
  currentPaymentStatus: string;
};

export default function OrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          paymentStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "No se pudo actualizar el pedido");
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Estatus del pedido
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
        >
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
          <option value="preparando">Preparando</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Estatus de pago
        </label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
        >
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
          <option value="fallido">Fallido</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-70"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {loading ? "Guardando..." : "Actualizar pedido"}
      </button>
    </form>
  );
}