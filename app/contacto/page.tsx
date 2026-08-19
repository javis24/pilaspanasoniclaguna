import type { Metadata } from "next";
import StaticPageLayout from "../components/store/StaticPageLayout";

export const metadata: Metadata = {
  title: "Contacto | Panasonic Pilas",
  description:
    "Contáctanos para resolver dudas sobre productos, pedidos y entregas.",
};

export default function ContactoPage() {
  return (
    <StaticPageLayout
      eyebrow="Estamos para ayudarte"
      title="Contacto"
      description="Comunícate con nosotros para recibir asesoría sobre productos, disponibilidad y entregas."
    >
      <div className="space-y-4 text-slate-600">
        <h2 className="text-2xl font-black text-slate-950">
          ¿Cómo podemos ayudarte?
        </h2>

        <p>
          Escríbenos para consultar existencias, solicitar recomendaciones o
          dar seguimiento a un pedido.
        </p>

        <p>
          Nuestro equipo te responderá con información sobre disponibilidad,
          métodos de pago y zonas de entrega.
        </p>
      </div>
    </StaticPageLayout>
  );
}