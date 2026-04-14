import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username musí mít alespoň 3 znaky")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Pouze písmena, čísla a podtržítko"),
  bio: z.string().max(300, "Bio může mít maximálně 300 znaků").optional(),
  avatarUrl: z.string().optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, bio, avatarUrl } = parsed.data;

    // Zkontroluj jestli username není zabrané jiným uživatelem
    if (username !== session.user.username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing) {
        return NextResponse.json(
          { error: "Username je již zabrané" },
          { status: 409 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { username, bio, avatarUrl },
      select: { id: true, username: true, bio: true, avatarUrl: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("PATCH /api/users/profile error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/users/profile error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const body = await request.json();
    const schema = z.object({
      currentPassword: z.string().min(1, "Současné heslo je povinné"),
      newPassword: z
        .string()
        .min(8, "Heslo musí mít alespoň 8 znaků")
        .regex(/[A-Z]/, "Heslo musí obsahovat alespoň jedno velké písmeno")
        .regex(/[a-z]/, "Heslo musí obsahovat alespoň jedno malé písmeno")
        .regex(/[0-9]/, "Heslo musí obsahovat alespoň jednu číslici")
        .regex(
          /[^A-Za-z0-9]/,
          "Heslo musí obsahovat alespoň jeden speciální znak"
        ),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
      return NextResponse.json(
        { error: "Uživatel nenalezen" },
        { status: 404 }
      );
    }

    const bcrypt = await import("bcryptjs");
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Současné heslo je nesprávné" },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ message: "Heslo bylo změněno" });
  } catch (error) {
    console.error("PUT /api/users/profile error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
