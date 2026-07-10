import Image from "next/image";
import Link from "next/link";
import { ImageIcon, Pencil, Plus } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import DeleteBannerButton from "@/app/components/dashboard/DeleteBannerButton";
import ToggleBannerStatusButton from "@/app/components/dashboard/ToggleBannerStatusButton";

function getImageSrc(image: string | null) {
  if (!image) return null;

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

export default async function BannersPage() {
  const banners = await prisma.banners.findMany({
    orderBy: {
      position: "asc",
    },
  });

  const activeBanners = banners.filter((banner) => banner.status === "activo");

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Banners</h1>
          <p className="mt-2 text-slate-500">
            Administra los banners principales de la tienda.
          </p>
        </div>

        <Link
          href="/dashboard/banners/nuevo"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Nuevo banner
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total banners</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {banners.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Banners activos</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {activeBanners.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Banner principal
          </p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">
            {banners.find((banner) => banner.position === 1)?.title ||
              "Sin asignar"}
          </h2>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Listado de banners
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4">Banner</th>
                <th className="px-6 py-4">Botón</th>
                <th className="px-6 py-4">URL</th>
                <th className="px-6 py-4">Posición</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        {getImageSrc(banner.image) ? (
                          <Image
                            src={getImageSrc(banner.image)!}
                            alt={banner.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon size={24} className="text-slate-400" />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {banner.title}
                        </p>
                        <p className="line-clamp-1 text-xs text-slate-500">
                          {banner.subtitle || "Sin subtítulo"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {banner.buttonText || "Sin botón"}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {banner.buttonUrl || "Sin URL"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {banner.position || 1}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        banner.status === "activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {banner.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <ToggleBannerStatusButton
                        bannerId={banner.id}
                        currentStatus={banner.status || "activo"}
                      />

                      <Link
                        href={`/dashboard/banners/${banner.id}/editar`}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Pencil size={15} />
                        Editar
                      </Link>

                      <DeleteBannerButton bannerId={banner.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {banners.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-500"
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