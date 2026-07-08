import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import ProductForm from "@/app/components/dashboard/ProductForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.products.findUnique({
      where: {
        id: Number(id),
      },
    }),
    prisma.categories.findMany({
      where: {
        status: "activo",
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/productos"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Volver a productos
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">
          Editar producto
        </h1>
        <p className="mt-2 text-slate-500">
          Modifica la información del producto seleccionado.
        </p>
      </div>

      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: String(product.price),
          discountPrice: product.discountPrice ? String(product.discountPrice) : "",
          stock: product.stock,
          sku: product.sku,
          image: product.image,
          status: product.status,
          featured: product.featured,
          categoryId: product.categoryId,
        }}
      />
    </div>
  );
}