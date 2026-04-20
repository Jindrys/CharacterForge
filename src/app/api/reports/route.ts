import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reportSchema = z.object({
  characterId: z.string().min(1),
  reason: z.string().min(5, "Důvod musí mít alespoň 5 znaků").max(500),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { characterId, reason } = parsed.data;

    // Zkontroluj jestli už uživatel nenahlásil tuto postavu
    const existing = await prisma.report.findFirst({
      where: { characterId, reporterId: session.user.id },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Tuto postavu jsi již nahlásil" },
        { status: 409 }
      );
    }

    const report = await prisma.report.create({
      data: {
        characterId,
        reporterId: session.user.id,
        reason,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("POST /api/reports error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
