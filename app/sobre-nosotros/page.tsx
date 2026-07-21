import type { Metadata } from "next";
import Link from "next/link";
import StaticPageLayout from "../components/store/StaticPageLayout";

export const metadata: Metadata = {
  title: "Sobre nosotros | Panasonic Pilas",
  description: "Conoce más sobre nuestro compromiso con la calidad, la distribución y la confianza en cada compra.",
};

export default function SobreNosotrosPage() {
  return (
    <StaticPageLayout
      eyebrow="Nuestra historia"
      title="Sobre nosotros"
      description="Conectamos a nuestros clientes con soluciones de energía confiables, desde pilas alcalinas hasta opciones recargables y de alto rendimiento."
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-5">
          <h2 className="text-2xl font-black text-slate-950">
            Compromiso con calidad y confianza
          </h2>
          <p className="text-slate-600">
            Somos una tienda especializada en productos Panasonic para el día a día, con un enfoque claro: ofrecer opciones seguras, duraderas y fáciles de encontrar para hogares, oficinas y negocios.
          </p>
          <p className="text-slate-600">
            Nuestra misión es ayudarte a tomar decisiones informadas con productos que cumplan tus necesidades de uso diario, ahorro energético y rendimiento constante.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-black text-slate-900">¿Qué nos diferencia?</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Atención cercana y recomendaciones claras.</li>
              <li>• Catálogo actualizado con productos de calidad.</li>
              <li>• Envío y seguimiento sencillo para que compres sin complicaciones.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">
            Nuestro propósito
          </p>
          <h3 className="mt-3 text-xl font-black text-slate-950">
            Tu energía, en el momento correcto
          </h3>
          <p className="mt-3 text-slate-600">
            Trabajamos para que cada compra sea rápida, confiable y útil, con productos pensados para ofrecer rendimiento y tranquilidad.
          </p>
          <Link
            href="/productos"
            className="mt-6 inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            Ver productos
          </Link>
        </div>
      </div>
    </StaticPageLayout>
  );
}
