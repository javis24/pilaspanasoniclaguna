import type { ReactNode } from "react";
import StoreTopBar from "./StoreTopBar";
import StoreHeader from "./StoreHeader";
import StoreNavbar from "./StoreNavbar";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function StaticPageLayout({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-slate-50">
      <StoreTopBar />
      <StoreHeader />
      <StoreNavbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">{title}</h1>
          <p className="mt-3 max-w-2xl text-slate-500">{description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {children}
        </div>
      </section>
    </main>
  );
}
