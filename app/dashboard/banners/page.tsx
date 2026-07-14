import Link from "next/link";
import { Plus, ImageIcon, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import DeleteBannerButton from "@/app/components/dashboard/DeleteBannerButton";
import ToggleBannerStatusButton from "@/app/components/dashboard/ToggleBannerStatusButton";

type BannerModel = {
  id: number;
  title: string;
  subtitle: string | null;
  image: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  position: number | null;
  status: "activo" | "inactivo" | null;
  createdAt: Date;
  updatedAt: Date;
};

export default async function BannersPage() {
  const banners = (await prisma.banners.findMany({
    orderBy: {
      position: "asc",
    },
  })) as BannerModel[];

  const activeBanners = banners.filter(
    (banner: BannerModel) => banner.status === "activo"
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Banners
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Administra los banners principales que aparecen en la página de
            inicio.
          </p>
        </div>

        <Link
          href="/dashboard/banners/nuevo"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
        >
          <Plus size={18} />
          Nuevo banner
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total banners</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                {banners.length}
              </h2>
            </div>
            <ImageIcon className="text-blue-700" size={32} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Activos</p>
              <h2 className="mt-2 text-3xl font-black text-green-600">
                {activeBanners.length}
              </h2>
            </div>
            <Eye className="text-green-600" size={32} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Inactivos</p>
              <h2 className="mt-2 text-3xl font-black text-red-600">
                {banners.length - activeBanners.length}
              </h2>
            </div>
            <EyeOff className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-black text-slate-950">
            Lista de banners
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Banner</th>
                <th className="px-5 py-4">Subtítulo</th>
                <th className="px-5 py-4">Botón</th>
                <th className="px-5 py-4">Posición</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {banners.map((banner: BannerModel) => (
                <tr key={banner.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">
                      {banner.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {banner.image || "Sin imagen"}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {banner.subtitle || "Sin subtítulo"}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {banner.buttonText || "Sin botón"}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-900">
                    {banner.position || 1}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        banner.status === "activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {banner.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/banners/${banner.id}/editar`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                      >
                        Editar
                      </Link>

                      <ToggleBannerStatusButton
                        bannerId={banner.id}
                        currentStatus={banner.status || "inactivo"}
                      />

                      <DeleteBannerButton bannerId={banner.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {banners.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No hay banners registrados.
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