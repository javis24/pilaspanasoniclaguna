import { redirect } from "next/navigation";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { getCurrentAdmin } from "../lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-72 min-h-screen">
        <Topbar />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}