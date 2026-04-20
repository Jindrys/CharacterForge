import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Přístup odepřen" }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          select: { id: true, username: true },
        },
        character: {
          select: {
            id: true,
            name: true,
            slug: true,
            owner: { select: { username: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("GET /api/admin/reports error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Přístup odepřen" }, { status: 403 });
    }

    const { reportId } = await request.json();

    const report = await prisma.report.update({
      where: { id: reportId },
      data: { resolved: true },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("PATCH /api/admin/reports error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
