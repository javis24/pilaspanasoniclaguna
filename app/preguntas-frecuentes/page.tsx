import type { Metadata } from "next";
import StaticPageLayout from "../components/store/StaticPageLayout";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | Panasonic Pilas",
  description: "Resuelve tus dudas sobre pedidos, entregas, disponibilidad y productos Panasonic.",
};

const faqs = [
  {
    question: "¿Cómo puedo saber si un producto tiene stock?",
    answer:
      "Puedes revisar la disponibilidad en la ficha del producto o contactarnos por WhatsApp para confirmar inventario antes de comprar.",
  },
  {
    question: "¿Puedo pedir varios productos en un solo pedido?",
    answer:
      "Sí, el carrito te permite agregar múltiples artículos y generar un pedido consolidado para revisión.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Atendemos pedidos por WhatsApp y podemos orientar sobre opciones de confirmación previa y entrega según tu zona.",
  },
];

export default function PreguntasFrecuentesPage() {
  return (
    <StaticPageLayout
      eyebrow="Ayuda rápida"
      title="Preguntas frecuentes"
      description="Respuestas claras para dudas comunes sobre productos, pedidos y entrega."
    >
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-black text-slate-950">{faq.question}</h2>
            <p className="mt-2 text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
}
