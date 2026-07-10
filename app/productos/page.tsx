import StoreTopBar from "../components/store/StoreTopBar";
import StoreHeader from "../components/store/StoreHeader";
import StoreNavbar from "../components/store/StoreNavbar";
import ProductCard from "../components/store/ProductCard";
import { prisma } from "../lib/prisma";

type Props = {
  searchParams: Promise<{
    categoria?: string;
  }>;
};

export default async function ProductosPage({ searchParams }: Props) {
  const { categoria } = await searchParams;

  const products = await prisma.products.findMany({
    where: {
      status: "activo",
      categories: categoria
        ? {
            slug: categoria,
          }
        : undefined,
    },
    include: {
      categories: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.categories.findMany({
    where: {
      status: "activo",
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <StoreTopBar />
      <StoreHeader />
      <StoreNavbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Tienda
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">
            Productos Panasonic
          </h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Encuentra pilas alcalinas, litio, zinc carbón, recargables Eneloop y baterías especiales.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">Categorías</h2>

          <div className="mt-5 space-y-2">
            <a
              href="/productos"
              className={`block rounded-xl px-4 py-3 text-sm font-semibold ${
                !categoria
                  ? "bg-blue-700 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Todas
            </a>

            {categories.map((category) => (
              <a
                key={category.id}
                href={`/productos?categoria=${category.slug}`}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold ${
                  categoria === category.slug
                    ? "bg-blue-700 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {category.name}
              </a>
            ))}
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {products.length} productos encontrados
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {products.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                No hay productos en esta categoría.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}