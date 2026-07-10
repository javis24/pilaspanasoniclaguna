"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  quantity: number;
  price: number;
};

const CART_KEY = "panasonic_cart";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export default function CartHeaderButton() {
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  function loadCart() {
    const storedCart = localStorage.getItem(CART_KEY);
    const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    const amount = cart.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    setTotalItems(items);
    setTotalAmount(amount);
  }

  useEffect(() => {
    loadCart();

    window.addEventListener("storage", loadCart);

    const interval = setInterval(loadCart, 800);

    return () => {
      window.removeEventListener("storage", loadCart);
      clearInterval(interval);
    };
  }, []);

  return (
    <Link href="/carrito" className="relative flex items-center gap-3">
      <div className="relative">
        <ShoppingCart size={34} className="text-slate-900" />
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
          {totalItems}
        </span>
      </div>

      <div>
        <p className="text-xs text-slate-500">Carrito</p>
        <p className="font-bold text-slate-900">
          {formatCurrency(totalAmount)}
        </p>
      </div>
    </Link>
  );
}