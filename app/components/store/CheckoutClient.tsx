"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, MessageCircle, Package, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

function createWhatsappOrderLink({
  customerName,
  customerPhone,
  shippingAddress,
  cart,
  total,
}: {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  cart: CartItem[];
  total: number;
}) {
  const phone = "528712194723";

  const productsText = cart
    .map((item, index) => {
      const subtotal = item.price * item.quantity;

      return `${index + 1}. ${item.name}%0A` +
        `Cantidad: ${item.quantity}%0A` +
        `Precio: $${item.price.toFixed(2)}%0A` +
        `Subtotal: $${subtotal.toFixed(2)}`;
    })
    .join("%0A%0A");

  const message =
    `Hola, acabo de generar un pedido:%0A%0A` +
    `Cliente: ${customerName}%0A` +
    `Teléfono: ${customerPhone}%0A` +
    `Dirección: ${shippingAddress}%0A%0A` +
    `Productos:%0A${productsText}%0A%0A` +
    `Total: $${total.toFixed(2)}%0A%0A` +
    `Quedo pendiente de confirmación.`;

  return `https://wa.me/${phone}?text=${message}`;
}

export default function CheckoutClient() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [whatsappLink, setWhatsappLink] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    paymentMethod: "whatsapp",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_KEY);
    const parsedCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    setCart(parsedCart);
    setMounted(true);
  }, []);

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (cart.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "No se pudo crear el pedido");
        return;
      }

      const link = createWhatsappOrderLink({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        shippingAddress: form.shippingAddress,
        cart,
        total,
      });

      setCreatedOrderId(data.order.id);
      setWhatsappLink(link);

      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("storage"));
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Cargando checkout...
        </div>
      </section>
    );
  }

  if (createdOrderId) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-600">
            <ShoppingCart size={40} />
          </div>

          <h2 className="mt-6 text-3xl font-black text-slate-950">
            Pedido creado correctamente
          </h2>

          <p className="mt-3 text-slate-500">
            Tu pedido #{createdOrderId} fue registrado. Para confirmar
            disponibilidad y entrega, envíanos el pedido por WhatsApp.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 text-sm font-bold text-white hover:bg-green-700"
            >
              <MessageCircle size={20} />
              Enviar por WhatsApp
            </a>

            <Link
              href="/productos"
              className="flex items-center justify-center rounded-xl border border-slate-300 px-5 py-4 text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <Package className="mx-auto text-blue-700" size={50} />
          <h2 className="mt-5 text-2xl font-black text-slate-950">
            No hay productos en el carrito
          </h2>
          <p className="mt-2 text-slate-500">
            Agrega productos antes de continuar al checkout.
          </p>
          <Link
            href="/productos"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white hover:bg-blue-800"
          >
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_420px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Datos del cliente
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Nombre completo
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                placeholder="Nombre del cliente"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Teléfono
              </label>
              <input
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                placeholder="871 000 0000"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Correo electrónico
              </label>
              <input
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                placeholder="cliente@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Método de pago
              </label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              >
                <option value="whatsapp">Confirmar por WhatsApp</option>
                <option value="efectivo">Efectivo contra entrega</option>
                <option value="transferencia">Transferencia bancaria</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Dirección de entrega
              </label>
              <textarea
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                placeholder="Calle, número, colonia, ciudad y referencias..."
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 text-sm font-bold text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Creando pedido..." : "Crear pedido"}
        </button>
      </form>

      <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">
          Resumen del pedido
        </h2>

        <div className="mt-6 space-y-4">
          {cart.map((item) => {
            const imageSrc = getImageSrc(item.image);

            return (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package size={22} className="text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="line-clamp-2 text-sm font-bold text-slate-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>

                <p className="text-sm font-black text-slate-950">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-slate-950">Total</span>
            <span className="text-2xl font-black text-blue-700">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </aside>
    </section>
  );
}