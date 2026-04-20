import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, Shield, Heart } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  return {
    title: username,
    description: `Profil hráče ${username} na CharacterForge.`,
  };
}

async function getUserProfile(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      bio: true,
      avatarUrl: true,
      instagram: true,
      twitter: true,
      discord: true,
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
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {user.bio}
              </p>
            )}

            {/* Sociální sítě */}
            {(user.instagram || user.twitter || user.discord) && (
              <div className="flex flex-wrap gap-3 mt-2">
                {user.instagram && (
                  <a
                    href={`https://instagram.com/${user.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors text-pink-400 hover:text-pink-300"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    @{user.instagram}
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={`https://twitter.com/${user.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    @{user.twitter}
                  </a>
                )}
                {user.discord && (
                  <a
                    href={`https://discord.gg/${user.discord}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors text-indigo-400 hover:text-indigo-300"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.102.132 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                    </svg>
                    Discord
                  </a>
                )}
              </div>
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
