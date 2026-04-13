import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CharacterWizard } from "@/components/characters/CharacterWizard";

export default async function NewCharacterPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-950">
      <CharacterWizard />
    </div>
  );
}
