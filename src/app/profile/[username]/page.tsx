import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, Shield, Heart } from "lucide-react";
import type { CharacterWithRelations } from "@/types";

async function getUserProfile(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      characters: {
        where: { isPublic: true },
        include: {
          stats: true,
          equipment: true,
          owner: {
            select: { id: true, username: true, avatarUrl: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("cs-CZ", {
    month: "long",
    year: "numeric",
  });
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  const user = await getUserProfile(username);

  if (!user) notFound();

  const isOwner = session?.user.username === username;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Zpět */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět
        </Link>

        {/* Profil header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="h-24 bg-linear-to-br from-amber-950 via-gray-900 to-gray-950" />
          <div className="px-8 pb-8">
            <div className="flex items-end gap-5 -mt-10 mb-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gray-800 border-4 border-gray-900 overflow-hidden shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="pb-1 flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-white">
                    {user.username}
                  </h1>
                  {isOwner && (
                    <Link
                      href="/profile/edit"
                      className="text-xs border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Upravit profil
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                  <Calendar className="w-3 h-3" />
                  Člen od {formatDate(user.createdAt)}
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-gray-300 text-sm leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex gap-4 mt-4">
              <div className="text-sm">
                <span className="text-white font-semibold">
                  {user.characters.length}
                </span>
                <span className="text-gray-500 ml-1">veřejných postav</span>
              </div>
            </div>
          </div>
        </div>

        {/* Postavy */}
        <div className="space-y-4">
          <div className="text-amber-500 text-xs font-medium uppercase tracking-widest">
            Postavy
          </div>

          {user.characters.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
              <div className="text-4xl mb-4">⚔️</div>
              <div className="text-gray-400">Žádné veřejné postavy</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {user.characters.map((character) => (
                <Link key={character.id} href={`/hero/${character.slug}`}>
                  <div className="bg-gray-900 border border-gray-800 hover:border-amber-800 rounded-2xl overflow-hidden cursor-pointer group transition-colors">
                    <div className="h-36 bg-gray-800 flex items-center justify-center overflow-hidden">
                      {character.avatarUrl ? (
                        <img
                          src={character.avatarUrl}
                          alt={character.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-amber-900 border border-amber-700 flex items-center justify-center text-amber-300 font-bold text-xl">
                          {character.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-white font-medium truncate">
                        {character.name}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {character.race} · {character.class}
                      </div>
                      <div className="text-amber-400 text-xs mt-1">
                        Lvl {character.level}
                      </div>
                      {character.stats && (
                        <div className="flex gap-3 mt-2">
                          <div className="flex items-center gap-1 text-red-400 text-xs">
                            <Heart className="w-3 h-3" />
                            {character.stats.maxHp}
                          </div>
                          <div className="flex items-center gap-1 text-blue-400 text-xs">
                            <Shield className="w-3 h-3" />
                            {character.stats.armorClass}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
