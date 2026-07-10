import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import BannerForm from "@/app/components/dashboard/BannerForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarBannerPage({ params }: Props) {
  const { id } = await params;

  const banner = await prisma.banners.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!banner) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/banners"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Volver a banners
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">Editar banner</h1>
        <p className="mt-2 text-slate-500">
          Modifica el contenido visual del banner.
        </p>
      </div>

      <BannerForm
        banner={{
          id: banner.id,
          title: banner.title,
          subtitle: banner.subtitle,
          image: banner.image,
          buttonText: banner.buttonText,
          buttonUrl: banner.buttonUrl,
          position: banner.position,
          status: banner.status,
        }}
      />
    </div>
  );
}