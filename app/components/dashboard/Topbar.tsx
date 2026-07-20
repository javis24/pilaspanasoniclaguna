"use client";

import { Bell, LogOut, Search, UserCircle, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("buscar") || "";
  const [search, setSearch] = useState(currentSearch);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      router.push("/dashboard/productos");
      return;
    }

    router.push(`/dashboard/productos?buscar=${encodeURIComponent(value)}`);
  }

  function clearSearch() {
    setSearch("");

    if (pathname.startsWith("/dashboard/productos")) {
      router.push("/dashboard/productos");
    }
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
        <form
          onSubmit={handleSearch}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 md:flex"
        >
          <Search size={18} className="text-slate-400" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Buscar producto, SKU, categoría..."
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-slate-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          )}
        </form>

        <button className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <UserCircle size={22} className="text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Admin</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <LogOut size={18} />
          Salir
        </button>
      </div>
    </header>
  );
}