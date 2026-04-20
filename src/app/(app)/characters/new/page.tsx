import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CharacterWizard } from "@/components/characters/CharacterWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nová postava",
  description: "Vytvoř novou postavu pro svou RPG hru.",
};

export default async function NewCharacterPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-950">
      <CharacterWizard />
    </div>
  );
}
