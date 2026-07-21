import Link from "next/link";
import { Headphones, User } from "lucide-react";
import CartHeaderButton from "./CartHeaderButton";
import StoreSearchBar from "./StoreSearchBar";
import { prisma } from "@/app/lib/prisma";
import Image from "next/image";

type CategoryModel = {
  id: number;
  name: string;
  slug: string;
};

type ProductWithCategory = {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  image: string | null;
  categories: {
    name: string;
  } | null;
};

export default async function StoreHeader() {
  const categories = (await prisma.categories.findMany({
    where: {
      status: "activo",
    },
    orderBy: {
      name: "asc",
    },
  })) as CategoryModel[];

  const products = (await prisma.products.findMany({
    where: {
      status: "activo",
    },
    include: {
      categories: true,
    },
    orderBy: {
      name: "asc",
    },
    take: 200,
  })) as ProductWithCategory[];

  const productSuggestions = products.map((product: ProductWithCategory) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    image: product.image,
    categoryName: product.categories?.name || null,
  }));


  const whatsappHelpMessage = encodeURIComponent(
  "Hola, necesito ayuda para escoger la pila adecuada o tengo una duda sobre un producto."
);

const whatsappHelpUrl = `https://wa.me/528711779093?text=${whatsappHelpMessage}`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-5 px-4 py-5 lg:grid-cols-[240px_1fr_420px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/LogoPilas.png"
            alt="Panasonic Battery Store"
            width={100}
            height={20}
            priority
            className="h-auto w-[110px] object-contain"
          />
        </Link>

        <StoreSearchBar
          categories={categories}
          products={productSuggestions}
        />

        <div className="hidden items-center justify-end gap-6 lg:flex">
          <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
          
                      <a
            href={whatsappHelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border-r border-slate-200 pr-6 transition hover:text-green-600"
          >
           

            <div>
              <p className="text-xs text-slate-500">¿Necesitas ayuda?</p>
              <p className="font-bold text-slate-900">871 177 9093</p>
              <p className="text-xs font-semibold text-green-600">
                Escríbenos por WhatsApp
              </p>
            </div>
          </a>
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