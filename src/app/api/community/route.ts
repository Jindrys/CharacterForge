import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const race = searchParams.get("race") || "";
    const cls = searchParams.get("class") || "";
    const minLevel = parseInt(searchParams.get("minLevel") || "1");
    const maxLevel = parseInt(searchParams.get("maxLevel") || "20");
    const sort = searchParams.get("sort") || "newest";
    const limit = parseInt(searchParams.get("limit") || "32");
    const page = parseInt(searchParams.get("page") || "1");

    const where = {
      isPublic: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          {
            owner: {
              username: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }),
      ...(race && { race: { contains: race, mode: "insensitive" as const } }),
      ...(cls && { class: { contains: cls, mode: "insensitive" as const } }),
      level: { gte: minLevel, lte: maxLevel },
    };

    const orderBy =
      sort === "newest"
        ? { createdAt: "desc" as const }
        : sort === "oldest"
        ? { createdAt: "asc" as const }
        : sort === "level_desc"
        ? { level: "desc" as const }
        : sort === "level_asc"
        ? { level: "asc" as const }
        : { createdAt: "desc" as const };

    const [characters, total] = await Promise.all([
      prisma.character.findMany({
        where,
        include: {
          stats: true,
          equipment: true,
          owner: {
            select: { id: true, username: true, avatarUrl: true },
          },
        },
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.character.count({ where }),
    ]);

    return NextResponse.json({
      characters,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/community error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
