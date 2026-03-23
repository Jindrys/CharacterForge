import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { characterSchema } from "@/lib/validations/character";
import { generateSlug } from "@/lib/utils";

// GET /api/characters — seznam vlastních postav
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const characters = await prisma.character.findMany({
      where: { ownerId: session.user.id },
      include: {
        stats: true,
        equipment: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(characters);
  } catch (error) {
    console.error("GET /api/characters error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

// POST /api/characters — vytvoření nové postavy
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = characterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { stats, equipment, ...characterData } = parsed.data;

    const character = await prisma.character.create({
      data: {
        ...characterData,
        slug: generateSlug(characterData.name),
        ownerId: session.user.id,
        stats: {
          create: stats,
        },
        equipment: {
          create: equipment,
        },
      },
      include: {
        stats: true,
        equipment: true,
      },
    });

    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    console.error("POST /api/characters error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
