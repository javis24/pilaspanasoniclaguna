import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Package } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import OrderStatusForm from "@/app/components/dashboard/OrderStatusForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value));
}

function getImageSrc(image: string | null) {
  if (!image) return null;

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

function createWhatsappLink(order: {
  id: number;
  customerName: string;
  customerPhone: string | null;
  shippingAddress: string | null;
  total: unknown;
}) {
  const phone = order.customerPhone
    ? `52${order.customerPhone.replace(/\D/g, "")}`
    : "528712194723";

  const message =
    `Hola ${order.customerName}, te contactamos sobre tu pedido #${order.id}.%0A%0A` +
    `Total: $${Number(order.total).toFixed(2)}%0A` +
    `Dirección: ${order.shippingAddress || "Sin dirección"}%0A%0A` +
    `Estamos revisando tu pedido.`;

  return `https://wa.me/${phone}?text=${message}`;
}

export default async function PedidoDetallePage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.orders.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      order_items: {
        include: {
          products: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const whatsappLink = createWhatsappLink(order);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/pedidos"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Volver a pedidos
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">
          Pedido #{order.id}
        </h1>

        <p className="mt-2 text-slate-500">
          Detalle completo del pedido recibido.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Datos del cliente
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Info label="Cliente" value={order.customerName} />
              <Info label="Teléfono" value={order.customerPhone || "Sin teléfono"} />
              <Info label="Correo" value={order.customerEmail || "Sin correo"} />
              <Info label="Método de pago" value={order.paymentMethod || "Sin método"} />
              <div className="md:col-span-2">
                <Info
                  label="Dirección"
                  value={order.shippingAddress || "Sin dirección"}
                />
              </div>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
            >
              <MessageCircle size={18} />
              Contactar por WhatsApp
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                Productos del pedido
              </h2>
            </div>

            <div className="divide-y divide-slate-200">
              {order.order_items.map((item) => {
                const imageSrc = getImageSrc(item.products.image);

                return (
                  <div
                    key={item.id}
                    className="grid gap-5 px-6 py-5 md:grid-cols-[1fr_110px_110px_120px] md:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={item.products.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package size={22} className="text-slate-400" />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          {item.products.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          SKU: {item.products.sku || "Sin SKU"}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-slate-900">
                      {formatCurrency(item.price)}
                    </p>

                    <p className="font-bold text-slate-900">
                      x {item.quantity}
                    </p>

                    <p className="text-right font-black text-slate-900">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Resumen
            </h2>

            <div className="mt-5 space-y-3">
              <Info label="Estatus pedido" value={order.status || "pendiente"} />
              <Info
                label="Estatus pago"
                value={order.paymentStatus || "pendiente"}
              />
              <Info
                label="Fecha"
                value={new Date(order.createdAt).toLocaleString("es-MX")}
              />
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-slate-900">Total</span>
                <span className="text-2xl font-black text-blue-700">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Actualizar pedido
            </h2>

            <div className="mt-6">
              <OrderStatusForm
                orderId={order.id}
                currentStatus={order.status || "pendiente"}
                currentPaymentStatus={order.paymentStatus || "pendiente"}
              />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}