import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { characterSchema } from "@/lib/validations/character";

type Params = { params: Promise<{ id: string }> };

// GET /api/characters/[id] — detail postavy
export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const { id } = await params;

    const character = await prisma.character.findFirst({
      where: { id, ownerId: session.user.id },
      include: {
        stats: true,
        equipment: true,
        history: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!character) {
      return NextResponse.json(
        { error: "Postava nenalezena" },
        { status: 404 }
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error("GET /api/characters/[id] error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

// PATCH /api/characters/[id] — úprava postavy
export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = characterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.character.findFirst({
      where: { id, ownerId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Postava nenalezena" },
        { status: 404 }
      );
    }

    const { stats, equipment, ...characterData } = parsed.data;

    // Smaž staré vybavení a vytvoř nové
    await prisma.equipment.deleteMany({ where: { characterId: id } });

    const character = await prisma.character.update({
      where: { id },
      data: {
        ...characterData,
        stats: {
          upsert: {
            create: stats,
            update: stats,
          },
        },
        equipment: {
          create: equipment,
        },
        history: {
          create: { note: `Postava upravena` },
        },
      },
      include: {
        stats: true,
        equipment: true,
        history: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });

    return NextResponse.json(character);
  } catch (error) {
    console.error("PATCH /api/characters/[id] error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

// DELETE /api/characters/[id] — smazání postavy
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.character.findFirst({
      where: { id, ownerId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Postava nenalezena" },
        { status: 404 }
      );
    }

    await prisma.character.delete({ where: { id } });

    return NextResponse.json({ message: "Postava smazána" });
  } catch (error) {
    console.error("DELETE /api/characters/[id] error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
