import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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

    if (!character) {
      return NextResponse.json(
        { error: "Postava nenalezena" },
        { status: 404 }
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error("GET /api/characters/slug/[slug] error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
