import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";

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

function getImageSrc(image: string | null) {
  if (!image) return null;

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const price = Number(product.price);
  const discountPrice = product.discountPrice
    ? Number(product.discountPrice)
    : null;

  const hasDiscount = discountPrice && discountPrice < price;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative h-56 bg-slate-50">
          {hasDiscount && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
              Oferta
            </span>
          )}

          {product.featured && (
            <span className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-blue-700 px-3 py-1 text-xs font-bold text-white">
              <Star size={13} />
              Top
            </span>
          )}

          {getImageSrc(product.image) ? (
            <Image
              src={getImageSrc(product.image)!}
              alt={product.name}
              fill
              className="object-contain p-6 transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Sin imagen
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            {product.categories?.name || "Panasonic"}
          </p>

          <h3 className="mt-2 line-clamp-2 min-h-[48px] text-base font-bold text-slate-900">
            {product.name}
          </h3>

          <div className="mt-4 flex items-end gap-2">
            {hasDiscount ? (
              <>
                <p className="text-xl font-black text-blue-700">
                  ${discountPrice.toFixed(2)}
                </p>
                <p className="text-sm text-slate-400 line-through">
                  ${price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-xl font-black text-slate-900">
                ${price.toFixed(2)}
              </p>
            )}
          </div>

          <p
            className={`mt-2 text-xs font-semibold ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
          </p>
        </div>
      </Link>

      <div className="border-t border-slate-100 p-5 pt-0">
        <button
          disabled={product.stock <= 0}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ShoppingCart size={18} />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}