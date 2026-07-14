import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

type BannerModel = {
  id: number;
  title: string;
  subtitle: string | null;
  image: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  position: number | null;
};

function getImageSrc(image: string | null) {
  if (!image) return "/images/banner-placeholder.jpg";

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

export default async function HeroBanners() {
  const banners = (await prisma.banners.findMany({
    where: {
      status: "activo",
    },
    orderBy: {
      position: "asc",
    },
  })) as BannerModel[];

  const mainBanner = banners[0];

  const sideBanners = banners.slice(1, 3);

  if (!mainBanner) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="relative min-h-[380px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-700 to-slate-950 p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-100">
              Panasonic Batteries
            </p>

            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Energía confiable para tu día a día
            </h1>

            <p className="mt-4 text-lg text-blue-100">
              Encuentra pilas Panasonic originales para hogar, negocio,
              controles, juguetes, equipos y más.
            </p>

            <Link
              href="/productos"
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-blue-800 transition hover:bg-blue-50"
            >
              Ver productos
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 lg:grid-cols-[2fr_1fr]">
      <div className="relative min-h-[380px] overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
        {mainBanner.image && (
          <Image
            src={getImageSrc(mainBanner.image)}
            alt={mainBanner.title}
            fill
            priority
            className="object-cover opacity-70"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />

        <div className="relative z-10 flex min-h-[320px] max-w-xl flex-col justify-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-100">
            Panasonic Batteries
          </p>

          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            {mainBanner.title}
          </h1>

          {mainBanner.subtitle && (
            <p className="mt-4 text-lg text-blue-100">
              {mainBanner.subtitle}
            </p>
          )}

          {mainBanner.buttonText && (
            <Link
              href={mainBanner.buttonUrl || "/productos"}
              className="mt-8 inline-flex w-fit rounded-full bg-white px-6 py-3 text-sm font-black text-blue-800 transition hover:bg-blue-50"
            >
              {mainBanner.buttonText}
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
        {sideBanners.length > 0 ? (
          sideBanners.map((banner: BannerModel, index: number) => (
            <div
              key={banner.id}
              className={`relative min-h-[160px] overflow-hidden rounded-2xl ${
                index === 0 ? "bg-blue-700" : "bg-slate-900"
              } p-6 text-white shadow-lg`}
            >
              {banner.image && (
                <Image
                  src={getImageSrc(banner.image)}
                  alt={banner.title}
                  fill
                  className="object-cover opacity-50"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              )}

              <div className="absolute inset-0 bg-slate-950/40" />

              <div className="relative z-10">
                <h2 className="text-2xl font-black">{banner.title}</h2>

                {banner.subtitle && (
                  <p className="mt-2 text-sm text-slate-100">
                    {banner.subtitle}
                  </p>
                )}

                {banner.buttonText && (
                  <Link
                    href={banner.buttonUrl || "/productos"}
                    className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-slate-900 transition hover:bg-slate-100"
                  >
                    {banner.buttonText}
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="rounded-2xl bg-blue-700 p-6 text-white shadow-lg">
              <h2 className="text-2xl font-black">Pilas Alcalinas</h2>
              <p className="mt-2 text-sm text-blue-100">
                Ideales para controles, juguetes y accesorios.
              </p>
              <Link
                href="/productos"
                className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-blue-800"
              >
                Comprar ahora
              </Link>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
              <h2 className="text-2xl font-black">Productos originales</h2>
              <p className="mt-2 text-sm text-slate-200">
                Energía confiable con calidad Panasonic.
              </p>
              <Link
                href="/productos"
                className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-slate-900"
              >
                Ver catálogo
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}