"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";

type ProductCartItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  stock: number;
  quantity: number;
};

type Props = {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    stock: number;
  };
};

const CART_KEY = "panasonic_cart";

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (product.stock <= 0) {
      alert("Este producto está agotado");
      return;
    }

    const currentCart = localStorage.getItem(CART_KEY);
    const cart: ProductCartItem[] = currentCart ? JSON.parse(currentCart) : [];

    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      const nextQuantity = existingProduct.quantity + 1;

      if (nextQuantity > product.stock) {
        alert("No puedes agregar más piezas de las disponibles");
        return;
      }

      existingProduct.quantity = nextQuantity;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event("storage"));

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
      className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      <ShoppingCart size={20} />
      {added ? "Agregado al carrito" : "Agregar al carrito"}
    </button>
  );
}