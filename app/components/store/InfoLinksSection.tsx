import Link from "next/link";
import { HelpCircle, Mail, Newspaper, Sparkles } from "lucide-react";

const links = [
  {
    href: "/sobre-nosotros",
    title: "Sobre nosotros",
    description: "Descubre quiénes somos y por qué nuestros productos se eligen con confianza.",
    icon: Sparkles,
  },
  {
    href: "/blog",
    title: "Blog",
    description: "Guías prácticas y consejos para encontrar la mejor opción energética.",
    icon: Newspaper,
  },
  {
    href: "/contacto",
    title: "Contacto",
    description: "Escríbenos para asesoría, dudas y confirmación de pedidos.",
    icon: Mail,
  },
  {
    href: "/preguntas-frecuentes",
    title: "Preguntas frecuentes",
    description: "Respuestas rápidas sobre stock, pedidos y entregas.",
    icon: HelpCircle,
  },
];

export default function InfoLinksSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">
              Explora más
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Conoce toda la información que necesitas
            </h2>
          </div>

          <Link
            href="/productos"
            className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Ver catálogo
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {links.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
