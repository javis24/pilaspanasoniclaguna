import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BatteryCharging,
  CheckCircle,
  MessageCircle,
  Package,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import StoreTopBar from "@/app/components/store/StoreTopBar";
import StoreHeader from "@/app/components/store/StoreHeader";
import StoreNavbar from "@/app/components/store/StoreNavbar";
import ProductCard from "@/app/components/store/ProductCard";
import AddToCartButton from "@/app/components/store/AddToCartButton";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function getImageSrc(image: string | null) {
  if (!image) return null;

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

function createWhatsappLink(product: {
  name: string;
  price: unknown;
  discountPrice: unknown | null;
  sku: string | null;
}) {
  const phone = "528712194723";

  const price = product.discountPrice
    ? Number(product.discountPrice)
    : Number(product.price);

  const message = `Hola, me interesa este producto:%0A%0AProducto: ${product.name}%0ASKU: ${
    product.sku || "Sin SKU"
  }%0APrecio: $${price.toFixed(2)}%0A%0A¿Me puedes dar más información?`;

  return `https://wa.me/${phone}?text=${message}`;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.products.findUnique({
    where: {
      slug,
    },
    include: {
      categories: true,
    },
  });

  if (!product || product.status !== "activo") {
    notFound();
  }

  const relatedProducts = await prisma.products.findMany({
    where: {
      status: "activo",
      categoryId: product.categoryId,
      NOT: {
        id: product.id,
      },
    },
    include: {
      categories: true,
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });

  const price = Number(product.price);
  const discountPrice = product.discountPrice
    ? Number(product.discountPrice)
    : null;

  const hasDiscount = discountPrice && discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice : price;
  const imageSrc = getImageSrc(product.image);
  const whatsappLink = createWhatsappLink(product);

  return (
    <main className="min-h-screen bg-slate-50">
      <StoreTopBar />
      <StoreHeader />
      <StoreNavbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Volver a productos
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
            {hasDiscount && (
              <span className="absolute left-5 top-5 z-10 rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase text-white">
                Oferta
              </span>
            )}

            {product.featured && (
              <span className="absolute right-5 top-5 z-10 flex items-center gap-1 rounded-full bg-blue-700 px-4 py-2 text-xs font-bold uppercase text-white">
                <Star size={14} />
                Destacado
              </span>
            )}

            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                priority
                className="object-contain p-10"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <Package size={70} />
                <p className="mt-3 text-sm font-medium">Sin imagen</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase text-blue-700">
              {product.categories?.name || "Panasonic"}
            </span>

            {product.sku && (
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase text-slate-600">
                SKU: {product.sku}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-6 flex items-end gap-3">
            {hasDiscount ? (
              <>
                <p className="text-4xl font-black text-blue-700">
                  ${finalPrice.toFixed(2)}
                </p>

                <p className="text-xl font-bold text-slate-400 line-through">
                  ${price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-4xl font-black text-slate-950">
                ${price.toFixed(2)}
              </p>
            )}
          </div>

          <div className="mt-5">
            {product.stock > 0 ? (
              <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                <CheckCircle size={18} />
                Disponible: {product.stock} piezas
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                <Package size={18} />
                Producto agotado
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-black text-slate-900">
              Descripción
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
              {product.description ||
                "Producto Panasonic de alta calidad, ideal para uso doméstico, oficina, negocio y dispositivos electrónicos."}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: finalPrice,
                image: product.image,
                stock: product.stock,
              }}
            />

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
            >
              <MessageCircle size={20} />
              Comprar por WhatsApp
            </a>
          </div>

          <div className="mt-8 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <Truck className="text-blue-700" size={24} />
              <p className="mt-3 text-sm font-bold text-slate-900">
                Envío local
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Gómez Palacio y alrededores
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <BatteryCharging className="text-blue-700" size={24} />
              <p className="mt-3 text-sm font-bold text-slate-900">
                Producto original
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Calidad Panasonic
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <ShoppingCart className="text-blue-700" size={24} />
              <p className="mt-3 text-sm font-bold text-slate-900">
                Compra fácil
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Carrito o WhatsApp
              </p>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              También te puede interesar
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Productos relacionados
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}