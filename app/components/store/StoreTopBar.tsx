import Link from "next/link";

export default function StoreTopBar() {
  return (
    <div className="bg-blue-700 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs md:text-sm">
        <div className="hidden gap-5 md:flex">
            <Link href="/sobre-nosotros" >
                Sobre nosotros
              </Link>

              <Link href="/blog" >
                Blog
              </Link>

              <Link href="/contacto" >
                Contacto
              </Link>

              <Link href="/preguntas-frecuentes" >
                Preguntas frecuentes
              </Link>
          </div>
        <p className="font-medium">
          Ahorra hasta 10% en productos seleccionados
        </p>

        <p className="hidden md:block">
          Envío disponible en toda la laguna.
        </p>
      </div>
    </div>
  );
}