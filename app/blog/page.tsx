import type { Metadata } from "next";
import Link from "next/link";
import StaticPageLayout from "../components/store/StaticPageLayout";

export const metadata: Metadata = {
  title: "Blog | Panasonic Pilas",
  description: "Descubre consejos, novedades y recomendaciones para elegir la batería o pila ideal.",
};

const posts = [
  {
    title: "¿Cómo elegir la pila correcta para cada dispositivo?",
    description:
      "Te compartimos una guía rápida para identificar el tipo de energía que mejor se adapta a tus necesidades.",
  },
  {
    title: "Ventajas de las pilas recargables Eneloop",
    description:
      "Aprende por qué cada recarga puede ayudarte a reducir desperdicios y ahorrar más en el largo plazo.",
  },
  {
    title: "Consejos para conservar mejor tus pilas",
    description:
      "Pequeños hábitos que pueden extender la vida útil de tus productos y mejorar su rendimiento.",
  },
];

export default function BlogPage() {
  return (
    <StaticPageLayout
      eyebrow="Información útil"
      title="Blog"
      description="Encuentra artículos prácticos, recomendaciones y novedades para aprovechar mejor tus compras de energía."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">
              Artículo destacado
            </p>
            <h2 className="mt-3 text-xl font-black text-slate-950">{post.title}</h2>
            <p className="mt-3 text-slate-600">{post.description}</p>
            <Link
              href="/productos"
              className="mt-5 inline-flex text-sm font-bold text-blue-700 hover:underline"
            >
              Ver productos relacionados
            </Link>
          </article>
        ))}
      </div>
    </StaticPageLayout>
  );
}
