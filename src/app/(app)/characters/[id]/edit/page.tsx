import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CharacterWizard } from "@/components/characters/CharacterWizard";
import type { CharacterFormData } from "@/types";

export default async function EditCharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  const character = await prisma.character.findFirst({
    where: { id, ownerId: session.user.id },
    include: { stats: true, equipment: true },
  });

  if (!character) notFound();

  const initialData: CharacterFormData = {
    name: character.name,
    race: character.race,
    class: character.class,
    level: character.level,
    backstory: character.backstory || "",
    avatarUrl: character.avatarUrl || "",
    isPublic: character.isPublic,
    stats: {
      strength: character.stats?.strength ?? 10,
      dexterity: character.stats?.dexterity ?? 10,
      constitution: character.stats?.constitution ?? 10,
      intelligence: character.stats?.intelligence ?? 10,
      wisdom: character.stats?.wisdom ?? 10,
      charisma: character.stats?.charisma ?? 10,
      maxHp: character.stats?.maxHp ?? 10,
      currentHp: character.stats?.currentHp ?? 10,
      armorClass: character.stats?.armorClass ?? 10,
      speed: character.stats?.speed ?? 30,
      initiative: character.stats?.initiative ?? 0,
    },
    equipment: character.equipment.map((e) => ({
      name: e.name,
      type: e.type,
      description: e.description || "",
      quantity: e.quantity,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <CharacterWizard initialData={initialData} characterId={id} />
    </div>
  );
}
