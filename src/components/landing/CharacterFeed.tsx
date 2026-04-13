import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CharacterCard } from "./CharacterCard";

async function getLatestCharacters() {
  return await prisma.character.findMany({
    where: { isPublic: true },
    include: {
      stats: true,
      equipment: true,
      owner: {
        select: { id: true, username: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function CharacterFeed() {
  const characters = await getLatestCharacters();

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-8">
        <div className="text-amber-500 text-xs font-medium uppercase tracking-widest">
          Nejnovější postavy
        </div>
        <Link href="/community" className="text-gray-400 hover:text-white text-sm transition-colors">
          Zobrazit vše →
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <div className="text-4xl mb-4">⚔️</div>
          <div className="text-lg mb-2">Zatím žádné postavy</div>
          <div className="text-sm">Buď první kdo vytvoří hrdinu!</div>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </section>
  );
}