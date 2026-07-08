"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  ImageIcon,
  Settings,
} from "lucide-react";

const menu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Productos", href: "/dashboard/productos", icon: Package },
  { label: "Categorías", href: "/dashboard/categorias", icon: Tags },
  { label: "Pedidos", href: "/dashboard/pedidos", icon: ShoppingCart },
  { label: "Banners", href: "/dashboard/banners", icon: ImageIcon },
  { label: "Configuración", href: "/dashboard/configuracion", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-200 bg-white">
      <div className="flex h-20 items-center border-b px-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Panasonic Store</h1>
          <p className="text-sm text-slate-500">Panel administrativo</p>
        </div>
      </div>

      <nav className="space-y-2 p-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}