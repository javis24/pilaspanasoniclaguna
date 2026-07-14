import Link from "next/link";
import { Eye, PackageCheck, ShoppingCart, Truck } from "lucide-react";
import { prisma } from "@/app/lib/prisma";

type OrderItemModel = {
  id: number;
  productId: number;
  quantity: number;
  price: unknown;
  subtotal: unknown;
  products: {
    id: number;
    name: string;
    image: string | null;
  };
};

type OrderModel = {
  id: number;
  customerName: string;
  customerPhone: string | null;
  total: unknown;
  status: string | null;
  createdAt: Date;
  order_items: OrderItemModel[];
};

function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value));
}

function getStatusClass(status: string | null) {
  switch (status) {
    case "entregado":
      return "bg-green-100 text-green-700";
    case "enviado":
      return "bg-blue-100 text-blue-700";
    case "preparando":
      return "bg-purple-100 text-purple-700";
    case "cancelado":
      return "bg-red-100 text-red-700";
    case "pagado":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default async function PedidosPage() {
  const orders = (await prisma.orders.findMany({
    include: {
      order_items: {
        include: {
          products: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as OrderModel[];

  const pendingOrders = orders.filter(
    (order: OrderModel) => order.status === "pendiente"
  );

  const preparingOrders = orders.filter(
    (order: OrderModel) => order.status === "preparando"
  );

  const deliveredOrders = orders.filter(
    (order: OrderModel) => order.status === "entregado"
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pedidos</h1>
        <p className="mt-2 text-slate-500">
          Administra los pedidos recibidos desde la tienda.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ShoppingCart className="text-blue-700" size={28} />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Total pedidos
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {orders.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <PackageCheck className="text-yellow-600" size={28} />
          <p className="mt-4 text-sm font-medium text-slate-500">Pendientes</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingOrders.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Truck className="text-purple-600" size={28} />
          <p className="mt-4 text-sm font-medium text-slate-500">Preparando</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-600">
            {preparingOrders.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <PackageCheck className="text-green-600" size={28} />
          <p className="mt-4 text-sm font-medium text-slate-500">Entregados</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {deliveredOrders.length}
          </h2>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Listado de pedidos
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4">Pedido</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Productos</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estatus</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {orders.map((order: OrderModel) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    #{order.id}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {order.customerName}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {order.customerPhone || "Sin teléfono"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {order.order_items.length} producto(s)
                    </span>
                  </td>

                  <td className="px-6 py-4 font-black text-slate-900">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        order.status || "pendiente"
                      )}`}
                    >
                      {order.status || "pendiente"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString("es-MX")}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <Link
                        href={`/dashboard/pedidos/${order.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Eye size={15} />
                        Ver detalle
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No hay pedidos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}