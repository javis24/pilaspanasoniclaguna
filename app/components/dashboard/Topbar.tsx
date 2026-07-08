"use client";

import { Bell, LogOut, Search, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Administración
        </h2>
        <p className="text-sm text-slate-500">
          Gestiona productos, pedidos y contenido de la tienda.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 md:flex">
          <Search size={18} className="text-slate-400" />
          <input className="w-64 text-sm outline-none" placeholder="Buscar..." />
        </div>

        <button className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <UserCircle size={22} className="text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Admin</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-blue hover:bg-slate-800"
        >
          <LogOut size={18} />
          Salir
        </button>
      </div>
    </header>
  );
}