import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BannerForm from "@/app/components/dashboard/BannerForm";

export default function NuevoBannerPage() {
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

        <h1 className="text-3xl font-bold text-slate-900">Nuevo banner</h1>
        <p className="mt-2 text-slate-500">
          Agrega un nuevo banner para la página principal.
        </p>
      </div>

      <BannerForm />
    </div>
  );
}