import StoreTopBar from "../components/store/StoreTopBar";
import StoreHeader from "../components/store/StoreHeader";
import StoreNavbar from "../components/store/StoreNavbar";
import CartClient from "../components/store/CartClient";

export default function CarritoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <StoreTopBar />
      <StoreHeader />
      <StoreNavbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Carrito
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">
            Tu carrito de compras
          </h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Revisa tus productos Panasonic antes de continuar con tu pedido.
          </p>
        </div>
      </section>

      <CartClient />
    </main>
  );
}