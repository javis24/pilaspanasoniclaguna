import Link from "next/link";
import { BatteryCharging, Headphones, Search, User } from "lucide-react";
import CartHeaderButton from "./CartHeaderButton";
import { prisma } from "@/app/lib/prisma";

 type CategoryModel = {
  id: number;
  name: string;
  slug: string;
};

export default async function StoreHeader() {
  const categories = await prisma.categories.findMany({
    where: {
      status: "activo",
    },
    orderBy: {
      name: "asc",
    },
  });

 

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-5 px-4 py-5 lg:grid-cols-[240px_1fr_420px]">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
            <BatteryCharging size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Panasonic
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Battery Store
            </p>
          </div>
        </Link>

        <form className="flex overflow-hidden rounded-xl border-2 border-blue-700 bg-white">
          <select className="hidden border-r border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none md:block">
            <option>Todas las categorías</option>
            {categories.map((category: CategoryModel) => (
              <option key={category.id}>{category.name}</option>
            ))}
          </select>

          <input
            className="min-w-0 flex-1 px-4 py-3 text-sm text-slate-700 outline-none"
            placeholder="Buscar pilas, baterías, modelos..."
          />

          <button
            type="submit"
            className="flex w-14 items-center justify-center bg-blue-700 text-white transition hover:bg-blue-800"
          >
            <Search size={21} />
          </button>
        </form>

        <div className="hidden items-center justify-end gap-6 lg:flex">
          <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
            <Headphones size={32} className="text-slate-900" />
            <div>
              <p className="text-xs text-slate-500">¿Necesitas ayuda?</p>
              <p className="font-bold text-slate-900">871 219 4723</p>
            </div>
          </div>

          <Link
            href="/admin/login"
            className="flex items-center gap-3 border-r border-slate-200 pr-6"
          >
            <User size={30} className="text-slate-900" />
            <div>
              <p className="text-xs text-slate-500">Mi cuenta</p>
              <p className="font-bold text-slate-900">Admin</p>
            </div>
          </Link>

          <CartHeaderButton />
        </div>
      </div>
    </header>
  );
}