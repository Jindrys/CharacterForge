import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CharacterSheet } from "@/components/characters/CharacterSheet";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const character = await prisma.character.findFirst({
    where: { slug, isPublic: true },
    select: {
      name: true,
      race: true,
      class: true,
      level: true,
      backstory: true,
      avatarUrl: true,
    },
  });

  if (!character) {
    return { title: "Postava nenalezena" };
  }

  return {
    title: character.name,
    description: `${character.race} ${character.class}, úroveň ${
      character.level
    }. ${character.backstory?.slice(0, 150) || ""}`,
    openGraph: {
      title: `${character.name} | CharacterForge`,
      description: `${character.race} ${character.class}, úroveň ${character.level}`,
      images: character.avatarUrl ? [character.avatarUrl] : [],
    },
  };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const character = await prisma.character.findFirst({
    where: {
      slug,
      OR: [{ isPublic: true }, { ownerId: session?.user.id }],
    },
    include: {
      stats: true,
      equipment: true,
      history: { orderBy: { createdAt: "desc" }, take: 10 },
      owner: {
        select: { id: true, username: true, avatarUrl: true },
      },
    },
  });

  if (!character) notFound();

  const isOwner = session?.user.id === character.ownerId;

  return (
    <div className="min-h-screen bg-gray-950">
      <CharacterSheet character={character as any} isOwner={isOwner} />
    </div>
  );
}
