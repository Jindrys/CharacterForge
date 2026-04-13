import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CharacterGrid } from "@/components/dashboard/CharacterGrid";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopCharacter } from "@/components/dashboard/TopCharacter";
import { PlusCircle, Sword, Users, Calendar, UserCog } from "lucide-react";
import Link from "next/link";

async function getDashboardData(userId: string) {
  const [characters, user] = await Promise.all([
    prisma.character.findMany({
      where: { ownerId: userId },
      include: {
        stats: true,
        equipment: true,
        owner: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, username: true },
    }),
  ]);

  return { characters, user };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Dobré ráno";
  if (hour < 18) return "Dobré odpoledne";
  return "Dobrý večer";
}

function formatDate(date: Date) {
  return date.toLocaleDateString("cs-CZ", { month: "long", year: "numeric" });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { characters, user } = await getDashboardData(session.user.id);

  const publicCount = characters.filter((c) => c.isPublic).length;
  const topCharacter =
    characters.find((c) => c.isPublic) ?? characters[0] ?? null;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-6 flex items-center justify-between">
          <div>
            <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-2">
              Vítej zpět
            </div>
            <div className="text-2xl font-bold text-white">
              {getGreeting()}, {session.user.username} ⚔️
            </div>
            {user && (
              <div className="text-gray-400 text-sm mt-1">
                Člen od {formatDate(user.createdAt)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/profile/edit"
              className="flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl transition-all"
            >
              <UserCog className="w-4 h-4" />
              Upravit profil
            </Link>
            <Link
              href="/characters/new"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              Nová postava
            </Link>
          </div>
        </div>

        {/* Stat karty */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<Sword className="w-5 h-5 text-amber-400" />}
            label="Celkem postav"
            value={characters.length}
          />
          <StatCard
            icon={<Users className="w-5 h-5 text-amber-400" />}
            label="Veřejné postavy"
            value={publicCount}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 text-amber-400" />}
            label="Člen od"
            value={user ? formatDate(user.createdAt) : "—"}
          />
        </div>

        {/* Nejpopulárnější postava */}
        {topCharacter && <TopCharacter character={topCharacter} />}

        {/* Grid postav */}
        <CharacterGrid characters={characters} />
      </div>
    </div>
  );
}
