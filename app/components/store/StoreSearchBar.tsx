"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type CategoryModel = {
  id: number;
  name: string;
  slug: string;
};

type ProductSuggestion = {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  image: string | null;
  categoryName: string | null;
};

type StoreSearchBarProps = {
  categories: CategoryModel[];
  products: ProductSuggestion[];
};

function getImageSrc(image: string | null) {
  if (!image) return null;

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

export default function StoreSearchBar({
  categories,
  products,
}: StoreSearchBarProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (text.length < 2) return [];

    return products
      .filter((product: ProductSuggestion) => {
        const name = product.name.toLowerCase();
        const sku = product.sku?.toLowerCase() || "";
        const category = product.categoryName?.toLowerCase() || "";

        return (
          name.includes(text) ||
          sku.includes(text) ||
          category.includes(text)
        );
      })
      .slice(0, 6);
  }, [search, products]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("buscar", search.trim());
    }

    if (categorySlug) {
      params.set("categoria", categorySlug);
    }

    const query = params.toString();

    router.push(query ? `/productos?${query}` : "/productos");
  }

  function handleCategoryChange(value: string) {
    setCategorySlug(value);

    if (value) {
      router.push(`/productos?categoria=${value}`);
    } else {
      router.push("/productos");
    }
  }

  function goToProduct(product: ProductSuggestion) {
    setSearch(product.name);
    setIsFocused(false);
    router.push(`/productos/${product.slug}`);
  }

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex overflow-hidden rounded-xl border-2 border-blue-700 bg-white"
      >
        <select
          value={categorySlug}
          onChange={(event) => handleCategoryChange(event.target.value)}
          className="hidden border-r border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none md:block"
        >
          <option value="">Todas las categorías</option>

          {categories.map((category: CategoryModel) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={() => setIsFocused(true)}
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

      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {suggestions.map((product: ProductSuggestion) => {
            const imageSrc = getImageSrc(product.image);

            return (
              <button
                key={product.id}
                type="button"
                onMouseDown={() => goToProduct(product)}
                className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-blue-50"
              >
                <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                      sizes="44px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      IMG
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {product.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {product.sku || "Sin SKU"} ·{" "}
                    {product.categoryName || "Sin categoría"}
                  </p>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
            }}
            className="w-full bg-slate-50 px-4 py-3 text-left text-sm font-bold text-blue-700 hover:bg-blue-100"
          >
            Ver todos los resultados para "{search}"
          </button>
        </div>
      )}
    </div>
  );
}