import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Přístup odepřen" }, { status: 403 });
    }

    const { characterId } = await request.json();

    await prisma.character.delete({ where: { id: characterId } });

    return NextResponse.json({ message: "Postava smazána" });
  } catch (error) {
    console.error("DELETE /api/admin/characters error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
