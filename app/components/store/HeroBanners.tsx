import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

function getImageSrc(image: string | null) {
  if (!image) return null;

  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return `/${image}`;
}

export default async function HeroBanners() {
  const banners = await prisma.banners.findMany({
    where: {
      status: "activo",
    },
    orderBy: {
      position: "asc",
    },
  });

  const mainBanner = banners[0];
  const sideBanners = banners.slice(1, 4);

  return (
    <section className="mx-auto grid max-w-7xl gap-3 px-4 py-5 lg:grid-cols-[1.55fr_1.05fr]">
      <div className="relative min-h-[340px] overflow-hidden rounded-2xl bg-blue-50">
        {mainBanner && getImageSrc(mainBanner.image) ? (
          <Image
            src={getImageSrc(mainBanner.image)!}
            alt={mainBanner.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-slate-100" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

        <div className="relative z-10 flex h-full max-w-md flex-col justify-center p-8 md:p-12">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">
            Productos Panasonic
          </p>

          <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            {mainBanner?.title || "Energía confiable para tu día"}
          </h2>

          <p className="mt-4 text-sm text-slate-600 md:text-base">
            {mainBanner?.subtitle ||
              "Encuentra pilas alcalinas, litio, recargables y baterías especiales."}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href={mainBanner?.buttonUrl || "/productos"}
              className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
            >
              {mainBanner?.buttonText || "Comprar ahora"}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
        {sideBanners.length > 0 ? (
          sideBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`relative min-h-[160px] overflow-hidden rounded-2xl ${
                index === 0 ? "bg-cyan-50" : "bg-blue-50"
              }`}
            >
              {getImageSrc(banner.image) && (
                <Image
                  src={getImageSrc(banner.image)!}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />

              <div className="relative z-10 max-w-[230px] p-6">
                <h3 className="text-xl font-black leading-tight text-slate-950">
                  {banner.title}
                </h3>

                {banner.subtitle && (
                  <p className="mt-2 text-sm text-slate-600">
                    {banner.subtitle}
                  </p>
                )}

                <Link
                  href={banner.buttonUrl || "/productos"}
                  className="mt-4 inline-block text-sm font-bold text-blue-700 underline"
                >
                  {banner.buttonText || "Ver productos"}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <>
            <PromoCard
              title="Pilas Alcalinas"
              subtitle="Duración y potencia"
              href="/productos"
            />
            <PromoCard
              title="Recargables Eneloop"
              subtitle="Ahorra y reutiliza"
              href="/productos"
            />
          </>
        )}
      </div>
    </section>
  );
}

function PromoCard({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div className="relative min-h-[160px] overflow-hidden rounded-2xl bg-slate-100 p-6">
      <h3 className="text-xl font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      <Link
        href={href}
        className="mt-4 inline-block text-sm font-bold text-blue-700 underline"
      >
        Comprar ahora
      </Link>
    </div>
  );
}