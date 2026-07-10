import Link from "next/link";
import { Battery, BatteryCharging, Zap } from "lucide-react";
import { prisma } from "@/app/lib/prisma";

const icons = [Battery, BatteryCharging, Zap];

export default async function CategorySection() {
  const categories = await prisma.categories.findMany({
    where: {
      status: "activo",
    },
    include: {
      products: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-wide text-blue-700">
          Categorías
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Compra por tipo de batería
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.slice(0, 8).map((category, index) => {
          const Icon = icons[index % icons.length];

          return (
            <Link
              key={category.id}
              href={`/productos?categoria=${category.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                <Icon size={28} />
              </div>

              <h3 className="mt-5 text-lg font-black text-slate-900">
                {category.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {category.products.length} productos disponibles
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}