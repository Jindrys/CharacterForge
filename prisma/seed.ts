import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const users = [
  {
    email: "dungeon@master.cz",
    username: "DungeonMaster",
    password: "Heslo123!",
    bio: "Zkušený Dungeon Master s 10 lety zkušeností. Tvořím světy plné nebezpečí a dobrodružství.",
    instagram: "dungeonmaster_cz",
    twitter: "dm_master_cz",
  },
  {
    email: "elara@elf.cz",
    username: "ElaraWood",
    password: "Heslo123!",
    bio: "Milovnice elfích příběhů a magie. Hraju D&D každý pátek večer.",
    instagram: "elara_plays",
  },
  {
    email: "thorin@dwarf.cz",
    username: "IronForge",
    password: "Heslo123!",
    bio: "Trpaslíci jsou nejlepší rasa. Žádná diskuze.",
    discord: "ironforge",
  },
  {
    email: "shadow@rogue.cz",
    username: "ShadowStep",
    password: "Heslo123!",
    bio: "Preferuji tmu a ticho. Zloděj v každé kampani.",
  },
  {
    email: "admin@characterforge.cz",
    username: "Admin",
    password: "Admin123!",
    bio: "Administrátor CharacterForge.",
    role: "ADMIN" as const,
  },
];

const characters = [
  // DungeonMaster postavy
  {
    username: "DungeonMaster",
    name: "Valdris Stormborn",
    race: "Human",
    class: "Wizard",
    level: 15,
    isPublic: true,
    backstory:
      "Valdris strávil dvacet let studiem zakázané magie v ruinách staré akademie. Jeho touha po vědění ho přivedla na pokraj šílenství, ale také mu dala moc, jakou málokdo poznal.",
    stats: {
      strength: 8,
      dexterity: 14,
      constitution: 12,
      intelligence: 20,
      wisdom: 16,
      charisma: 13,
      maxHp: 78,
      currentHp: 78,
      armorClass: 13,
      speed: 30,
      initiative: 2,
    },
    equipment: [
      {
        name: "Hůl archimága",
        type: "weapon",
        description: "Starověká hůl zdobená runami",
        quantity: 1,
      },
      {
        name: "Roucho ochrany",
        type: "armor",
        description: "+2 AC",
        quantity: 1,
      },
      {
        name: "Grimoár zakázaných kouzel",
        type: "item",
        description: "Obsahuje 50 kouzel",
        quantity: 1,
      },
    ],
  },
  {
    username: "DungeonMaster",
    name: "Krag the Destroyer",
    race: "Half-orc",
    class: "Barbarian",
    level: 8,
    isPublic: true,
    backstory:
      "Krag byl vychován kmenem divokých orků na severu. Jediné co zná je válka a krev. Přesto v sobě skrývá touhu po klidu, kterou nikdy nepřizná.",
    stats: {
      strength: 20,
      dexterity: 14,
      constitution: 18,
      intelligence: 8,
      wisdom: 10,
      charisma: 9,
      maxHp: 92,
      currentHp: 92,
      armorClass: 15,
      speed: 35,
      initiative: 2,
    },
    equipment: [
      {
        name: "Obouruční sekera",
        type: "weapon",
        description: "2d6 sečné poškození",
        quantity: 1,
      },
      {
        name: "Kožená zbroj",
        type: "armor",
        description: "Základní ochrana",
        quantity: 1,
      },
    ],
  },
  {
    username: "DungeonMaster",
    name: "Sister Mirael",
    race: "Human",
    class: "Cleric",
    level: 12,
    isPublic: true,
    backstory:
      "Mirael sloužila bohyni světla od svých pěti let. Ztratila celou svou vesnici při démonském útoku a od té doby přísahala vymýtit zlo ze světa.",
    stats: {
      strength: 14,
      dexterity: 10,
      constitution: 14,
      intelligence: 13,
      wisdom: 20,
      charisma: 16,
      maxHp: 84,
      currentHp: 84,
      armorClass: 18,
      speed: 30,
      initiative: 0,
    },
    equipment: [
      {
        name: "Svatý symbol",
        type: "item",
        description: "Symbol bohyně světla",
        quantity: 1,
      },
      {
        name: "Plátová zbroj",
        type: "armor",
        description: "AC 18",
        quantity: 1,
      },
      {
        name: "Palcát",
        type: "weapon",
        description: "1d6 drtivé poškození",
        quantity: 1,
      },
    ],
  },
  // ElaraWood postavy
  {
    username: "ElaraWood",
    name: "Lyraniel Moonwhisper",
    race: "High Elf",
    class: "Ranger",
    level: 7,
    isPublic: true,
    backstory:
      "Lyraniel opustila svůj les po tom, co temní elfové vypálili její domov. Nyní stopuje zlo po celém světě a hledá odplatu.",
    stats: {
      strength: 12,
      dexterity: 18,
      constitution: 13,
      intelligence: 14,
      wisdom: 15,
      charisma: 12,
      maxHp: 52,
      currentHp: 52,
      armorClass: 15,
      speed: 35,
      initiative: 4,
    },
    equipment: [
      {
        name: "Elfský dlouhý luk",
        type: "weapon",
        description: "+1 k útoku a poškození",
        quantity: 1,
      },
      {
        name: "Krátký meč",
        type: "weapon",
        description: "1d6 sečné poškození",
        quantity: 2,
      },
      {
        name: "Kožená zbroj",
        type: "armor",
        description: "Lehká zbroj",
        quantity: 1,
      },
      {
        name: "Léčivý lektvar",
        type: "item",
        description: "Obnoví 2d4+2 HP",
        quantity: 3,
      },
    ],
  },
  {
    username: "ElaraWood",
    name: "Zephyra Dawnbringer",
    race: "Half-elf",
    class: "Bard",
    level: 5,
    isPublic: true,
    backstory:
      "Zephyra cestuje světem a sbírá příběhy. Její hudba dokáže léčit i zabíjet. Nikdo neví odkud přišla, ale všichni si ji pamatují.",
    stats: {
      strength: 10,
      dexterity: 16,
      constitution: 12,
      intelligence: 13,
      wisdom: 12,
      charisma: 20,
      maxHp: 38,
      currentHp: 38,
      armorClass: 13,
      speed: 30,
      initiative: 3,
    },
    equipment: [
      {
        name: "Magická loutna",
        type: "item",
        description: "Nástroj bardem",
        quantity: 1,
      },
      {
        name: "Rapír",
        type: "weapon",
        description: "1d8 bodné poškození",
        quantity: 1,
      },
    ],
  },
  // IronForge postavy
  {
    username: "IronForge",
    name: "Durin Stonehammer",
    race: "Dwarf",
    class: "Fighter",
    level: 10,
    isPublic: true,
    backstory:
      "Durin je potomek legendárního kováře jehož zbraně nesou kletbu. Každá zbraň kterou Durin vytvoří přinese svému majiteli slávu, ale také zkázu.",
    stats: {
      strength: 18,
      dexterity: 12,
      constitution: 20,
      intelligence: 10,
      wisdom: 13,
      charisma: 10,
      maxHp: 98,
      currentHp: 98,
      armorClass: 20,
      speed: 25,
      initiative: 1,
    },
    equipment: [
      {
        name: "Runový válečný kladivo",
        type: "weapon",
        description: "+2 magická zbraň",
        quantity: 1,
      },
      {
        name: "Plátová zbroj předků",
        type: "armor",
        description: "AC 20, rodinný artefakt",
        quantity: 1,
      },
      {
        name: "Štít trpaslíků",
        type: "armor",
        description: "+2 AC",
        quantity: 1,
      },
      { name: "Léčivý lektvar", type: "item", quantity: 2 },
    ],
  },
  {
    username: "IronForge",
    name: "Brenna Copperkettle",
    race: "Dwarf",
    class: "Druid",
    level: 6,
    isPublic: true,
    backstory:
      "Brenna je raritem mezi trpaslíky — druidka která se stará o podzemní ekosystémy. Její zvířecí forma je obří krtek.",
    stats: {
      strength: 13,
      dexterity: 10,
      constitution: 16,
      intelligence: 12,
      wisdom: 18,
      charisma: 11,
      maxHp: 54,
      currentHp: 54,
      armorClass: 14,
      speed: 25,
      initiative: 0,
    },
    equipment: [
      {
        name: "Druidský fokus",
        type: "item",
        description: "Větev posvátného stromu",
        quantity: 1,
      },
      { name: "Kožená zbroj", type: "armor", quantity: 1 },
    ],
  },
  // ShadowStep postavy
  {
    username: "ShadowStep",
    name: "Narcelia Nightveil",
    race: "Drow",
    class: "Rogue",
    level: 9,
    isPublic: true,
    backstory:
      "Narcelia uprchla z podzemního města drowů poté, co odmítla vykonat vraždu pro pavoučí bohyni. Nyní žije v povrchním světě jako najatá zabijačka — ale vybírá si oběti pečlivě.",
    stats: {
      strength: 10,
      dexterity: 20,
      constitution: 12,
      intelligence: 15,
      wisdom: 13,
      charisma: 16,
      maxHp: 58,
      currentHp: 58,
      armorClass: 16,
      speed: 30,
      initiative: 5,
    },
    equipment: [
      {
        name: "Stínové dýky",
        type: "weapon",
        description: "+1, jedovaté",
        quantity: 2,
      },
      {
        name: "Kožená zbroj z pavučin",
        type: "armor",
        description: "AC 14, advantage na stealth",
        quantity: 1,
      },
      {
        name: "Jed ochromující",
        type: "item",
        description: "DC 15 Con save nebo paralyzován",
        quantity: 5,
      },
    ],
  },
  {
    username: "ShadowStep",
    name: "Syrien Ashwalker",
    race: "Human",
    class: "Ranger",
    level: 4,
    isPublic: true,
    backstory:
      "Syrien byl součástí elitní královské stráže dokud nebyl obviněn z velezrady. Nyní žije jako psanec a hledá důkazy své neviny.",
    stats: {
      strength: 14,
      dexterity: 17,
      constitution: 13,
      intelligence: 12,
      wisdom: 14,
      charisma: 11,
      maxHp: 34,
      currentHp: 34,
      armorClass: 14,
      speed: 30,
      initiative: 3,
    },
    equipment: [
      {
        name: "Kompozitní luk",
        type: "weapon",
        description: "1d8 bodné poškození",
        quantity: 1,
      },
      { name: "Krátký meč", type: "weapon", quantity: 1 },
      { name: "Středně těžká zbroj", type: "armor", quantity: 1 },
      { name: "Cestovní zásoby", type: "item", quantity: 5 },
    ],
  },
];

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${random}`;
}

async function main() {
  console.log("Spouštím seed...");

  // Smaž existující data
  await prisma.report.deleteMany();
  await prisma.characterHistory.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.characterStats.deleteMany();
  await prisma.character.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Stará data smazána");

  // Vytvoř uživatele
  const createdUsers: Record<string, string> = {};

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 12);
    const created = await prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        passwordHash,
        bio: user.bio,
        instagram: user.instagram || null,
        twitter: user.twitter || null,
        discord: user.discord || null,
        role: user.role || "USER",
      },
    });
    createdUsers[user.username] = created.id;
    console.log(`👤 Uživatel vytvořen: ${user.username}`);
  }

  // Vytvoř postavy
  for (const char of characters) {
    const ownerId = createdUsers[char.username];
    const { username, equipment, stats, ...charData } = char;

    await prisma.character.create({
      data: {
        ...charData,
        slug: generateSlug(char.name),
        ownerId,
        stats: { create: stats },
        equipment: { create: equipment },
        history: { create: { note: "Postava vytvořena" } },
      },
    });
    console.log(`⚔️  Postava vytvořena: ${char.name}`);
  }

  console.log("Seed dokončen!");
  console.log("\n Přihlašovací údaje:");
  console.log("─────────────────────────────────────");
  for (const user of users) {
    console.log(
      `${user.username.padEnd(20)} ${user.email.padEnd(30)} ${user.password}`
    );
  }
  console.log("─────────────────────────────────────");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
