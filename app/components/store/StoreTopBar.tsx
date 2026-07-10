export default function StoreTopBar() {
  return (
    <div className="bg-blue-700 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs md:text-sm">
        <div className="hidden gap-5 md:flex">
          <span>Sobre nosotros</span>
          <span>Blog</span>
          <span>Contacto</span>
          <span>Preguntas frecuentes</span>
        </div>

        <p className="font-medium">
          Ahorra hasta 10% en productos seleccionados
        </p>

        <p className="hidden md:block">
          Envío disponible en Gómez Palacio y alrededores
        </p>
      </div>
    </div>
  );
}