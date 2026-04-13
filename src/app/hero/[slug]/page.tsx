import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CharacterSheet } from "@/components/characters/CharacterSheet";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const character = await prisma.character.findFirst({
    where: { slug, isPublic: true },
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
