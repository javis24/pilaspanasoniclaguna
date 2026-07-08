import {
  Package,
  ShoppingCart,
  Tags,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import { prisma } from "../lib/prisma";

export default async function DashboardPage() {
  const productsCount = await prisma.products.count();
  const categoriesCount = await prisma.categories.count();
  const ordersCount = await prisma.orders.count();

  const lowStockCount = await prisma.products.count({
    where: {
      stock: {
        lte: 5,
      },
    },
  });

  const recentOrders = await prisma.orders.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      order_items: true,
    },
  });

  const products = await prisma.products.findMany();

  const inventoryValue = products.reduce((total, product) => {
    return total + Number(product.price) * product.stock;
  }, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-500">
          Resumen general de la tienda de pilas Panasonic.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Productos"
          value={productsCount}
          description="Productos registrados en catálogo"
          icon={Package}
        />

        <StatCard
          title="Categorías"
          value={categoriesCount}
          description="Categorías activas e inactivas"
          icon={Tags}
        />

        <StatCard
          title="Pedidos"
          value={ordersCount}
          description="Pedidos registrados en la tienda"
          icon={ShoppingCart}
        />

        <StatCard
          title="Bajo stock"
          value={lowStockCount}
          description="Productos con 5 piezas o menos"
          icon={AlertTriangle}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Últimos pedidos
          </h2>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Estatus</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3">${Number(order.total).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleDateString("es-MX")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-green-50 p-3 text-green-600">
              <DollarSign size={26} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Valor de inventario</p>
              <h2 className="text-2xl font-bold text-slate-900">
                ${inventoryValue.toFixed(2)}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Estimación del valor total considerando precio actual por stock
            disponible.
          </p>
        </div>
      </section>
    </div>
  );
}