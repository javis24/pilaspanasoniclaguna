import ProductCard from "./ProductCard";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: unknown;
  discountPrice: unknown | null;
  stock: number;
  image: string | null;
  featured: boolean | null;
  categories?: {
    name: string;
    slug: string;
  } | null;
};

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Catálogo
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Productos destacados
          </h2>
          <p className="mt-2 text-slate-500">
            Pilas y baterías Panasonic para hogar, oficina y negocio.
          </p>
        </div>

        <a
          href="/productos"
          className="text-sm font-bold text-blue-700 hover:underline"
        >
          Ver todos los productos
        </a>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {products.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No hay productos disponibles.
          </div>
        )}
      </div>
    </section>
  );
}