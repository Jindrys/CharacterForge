import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("Nejprve vytvoř uživatele přes /api/auth/register");
    return;
  }

  await prisma.character.create({
    data: {
      slug: "thorin-test",
      name: "Thorin",
      race: "Dwarf",
      class: "Fighter",
      level: 5,
      isPublic: true,
      ownerId: user.id,
      stats: {
        create: {
          maxHp: 45,
          currentHp: 45,
          armorClass: 16,
          strength: 18,
          dexterity: 12,
          constitution: 16,
          intelligence: 10,
          wisdom: 10,
          charisma: 8,
        },
      },
    },
  });

  console.log("✅ Postava vytvořena!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
