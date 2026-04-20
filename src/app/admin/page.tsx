import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminPanel } from "@/components/admin/AdminPanel";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-6">
          <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-2">
            Administrace
          </div>
          <div className="text-2xl font-bold text-white">Admin panel</div>
        </div>
        <AdminPanel />
      </div>
    </div>
  );
}
