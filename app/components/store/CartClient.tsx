"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  MessageCircle,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  stock: number;
  quantity: number;
};

const CART_KEY = "panasonic_cart";

function getImageSrc(image: string | null) {
  if (!image) return null;

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

function createWhatsappCartLink(cart: CartItem[]) {
  const phone = "528712194723";

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const productsMessage = cart
    .map((item, index) => {
      const subtotal = item.price * item.quantity;

      return `${index + 1}. ${item.name}%0A` +
        `Cantidad: ${item.quantity}%0A` +
        `Precio: $${item.price.toFixed(2)}%0A` +
        `Subtotal: $${subtotal.toFixed(2)}`;
    })
    .join("%0A%0A");

  const message =
    `Hola, quiero hacer un pedido de pilas Panasonic:%0A%0A` +
    `${productsMessage}%0A%0A` +
    `Total: $${total.toFixed(2)}%0A%0A` +
    `¿Me puedes confirmar disponibilidad?`;

  return `https://wa.me/${phone}?text=${message}`;
}

export default function CartClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_KEY);
    const parsedCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    setCart(parsedCart);
    setMounted(true);
  }, []);

  function saveCart(nextCart: CartItem[]) {
    setCart(nextCart);
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
  }

  function increaseQuantity(productId: number) {
    const nextCart = cart.map((item) => {
      if (item.id !== productId) return item;

      if (item.quantity >= item.stock) {
        alert("No puedes agregar más piezas de las disponibles");
        return item;
      }

      return {
        ...item,
        quantity: item.quantity + 1,
      };
    });

    saveCart(nextCart);
  }

  function decreaseQuantity(productId: number) {
    const nextCart = cart
      .map((item) => {
        if (item.id !== productId) return item;

        return {
          ...item,
          quantity: item.quantity - 1,
        };
      })
      .filter((item) => item.quantity > 0);

    saveCart(nextCart);
  }

  function removeItem(productId: number) {
    const confirmDelete = window.confirm(
      "¿Deseas eliminar este producto del carrito?"
    );

    if (!confirmDelete) return;

    const nextCart = cart.filter((item) => item.id !== productId);

    saveCart(nextCart);
  }

  function clearCart() {
    const confirmClear = window.confirm("¿Deseas vaciar todo el carrito?");

    if (!confirmClear) return;

    saveCart([]);
  }

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const shippingCost = 0;
  const total = subtotal + shippingCost;

  if (!mounted) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Cargando carrito...
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
            <ShoppingCart size={40} />
          </div>

          <h2 className="mt-6 text-2xl font-black text-slate-950">
            Tu carrito está vacío
          </h2>

          <p className="mx-auto mt-3 max-w-md text-slate-500">
            Agrega productos Panasonic al carrito para continuar con tu compra.
          </p>

          <Link
            href="/productos"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
          >
            <ArrowLeft size={18} />
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  const whatsappLink = createWhatsappCartLink(cart);

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Productos agregados
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {cart.length} producto(s) en tu carrito.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={18} />
            Vaciar carrito
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden border-b border-slate-200 bg-slate-100 px-6 py-4 text-sm font-bold text-slate-600 md:grid md:grid-cols-[1fr_140px_150px_120px]">
            <span>Producto</span>
            <span>Precio</span>
            <span>Cantidad</span>
            <span className="text-right">Subtotal</span>
          </div>

          <div className="divide-y divide-slate-200">
            {cart.map((item) => {
              const imageSrc = getImageSrc(item.image);
              const itemSubtotal = item.price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="grid gap-5 px-5 py-5 md:grid-cols-[1fr_140px_150px_120px] md:items-center"
                >
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/productos/${item.slug}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package size={26} className="text-slate-400" />
                        </div>
                      )}
                    </Link>

                    <div>
                      <Link
                        href={`/productos/${item.slug}`}
                        className="font-bold text-slate-950 hover:text-blue-700"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Stock disponible: {item.stock}
                      </p>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 md:hidden">Precio</p>
                    <p className="font-bold text-slate-950">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm text-slate-500 md:hidden">
                      Cantidad
                    </p>

                    <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex h-10 w-10 items-center justify-center text-slate-700 transition hover:bg-slate-100"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="flex h-10 min-w-12 items-center justify-center border-x border-slate-200 px-4 text-sm font-bold text-slate-950">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        disabled={item.quantity >= item.stock}
                        className="flex h-10 w-10 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500 md:hidden">
                      Subtotal
                    </p>
                    <p className="font-black text-slate-950">
                      {formatCurrency(itemSubtotal)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Link
          href="/productos"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"
        >
          <ArrowLeft size={18} />
          Seguir comprando
        </Link>
      </div>

      <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">
          Resumen del pedido
        </h2>

        <div className="mt-6 space-y-4 border-b border-slate-200 pb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-bold text-slate-950">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Envío</span>
            <span className="font-bold text-green-600">
              {shippingCost === 0 ? "Por confirmar" : formatCurrency(shippingCost)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-lg font-black text-slate-950">Total</span>
          <span className="text-2xl font-black text-blue-700">
            {formatCurrency(total)}
          </span>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          El costo de envío puede variar dependiendo de la zona de entrega.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/checkout"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
          >
            Continuar al checkout
          </Link>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
          >
            <MessageCircle size={20} />
            Pedir por WhatsApp
          </a>
        </div>
      </aside>
    </section>
  );
}