import StoreTopBar from "./components/store/StoreTopBar";
import StoreHeader from "./components/store/StoreHeader";
import StoreNavbar from "./components/store/StoreNavbar";
import HeroBanners from "./components/store/HeroBanners";
import CategorySection from "./components/store/CategorySection";
import ProductGrid from "./components/store/ProductGrid";
import { prisma } from "./lib/prisma";

export default async function HomePage() {
  const products = await prisma.products.findMany({
    where: {
      status: "activo",
    },
    include: {
      categories: true,
    },
    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 8,
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <StoreTopBar />
      <StoreHeader />
      <StoreNavbar />
      <HeroBanners />
      <CategorySection />
      <ProductGrid products={products} />
    </main>
  );
}