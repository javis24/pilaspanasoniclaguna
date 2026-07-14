import Link from "next/link";
import { BadgePercent, ChevronDown } from "lucide-react";
import { prisma } from "@/app/lib/prisma";

type CategoryModel = {
  id: number;
  name: string;
  slug: string;
};

export default async function StoreNavbar() {
  const categories = await prisma.categories.findMany({
    where: {
      status: "activo",
    },
    take: 6,
    orderBy: {
      name: "asc",
    },
  });

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-3">
          <Link
            href="/"
            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Inicio
          </Link>

          <Link
            href="/productos"
            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Productos
            <ChevronDown size={15} />
          </Link>

          {categories.map((category: CategoryModel) => (
            <Link
              key={category.id}
              href={`/productos?categoria=${category.slug}`}
              className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <Link
          href="/productos"
          className="hidden items-center gap-2 text-sm font-bold text-red-600 md:flex"
        >
          <BadgePercent size={22} />
          Ofertas
        </Link>
      </div>
    </nav>
  );
}