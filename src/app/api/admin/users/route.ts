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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { characters: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Přístup odepřen" }, { status: 403 });
    }

    const { userId } = await request.json();

    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Nemůžeš smazat svůj vlastní účet" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "Uživatel smazán" });
  } catch (error) {
    console.error("DELETE /api/admin/users error:", error);
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

    const { userId, role } = await request.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, username: true, role: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("PATCH /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
