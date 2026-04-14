import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        characters: {
          where: { isPublic: true },
          include: {
            stats: true,
            equipment: true,
            owner: {
              select: { id: true, username: true, avatarUrl: true },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Uživatel nenalezen" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/users/[username] error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
