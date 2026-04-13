import { z } from "zod";

export const characterSchema = z.object({
  name: z.string().min(1, "Jméno je povinné").max(100),
  race: z.string().min(1, "Rasa je povinná"),
  class: z.string().min(1, "Třída je povinná"),
  level: z.number().int().min(1).max(20),
  backstory: z.string().max(5000).optional(),
  avatarUrl: z.string().optional().or(z.literal("")),
  isPublic: z.boolean().default(false),
  stats: z.object({
    strength: z.number().int().min(1).max(30),
    dexterity: z.number().int().min(1).max(30),
    constitution: z.number().int().min(1).max(30),
    intelligence: z.number().int().min(1).max(30),
    wisdom: z.number().int().min(1).max(30),
    charisma: z.number().int().min(1).max(30),
    maxHp: z.number().int().min(1),
    currentHp: z.number().int().min(0),
    armorClass: z.number().int().min(1),
    speed: z.number().int().min(0),
  }),
  equipment: z
    .array(
      z.object({
        name: z.string().min(1),
        type: z.enum(["weapon", "armor", "item"]),
        description: z.string().optional(),
        quantity: z.number().int().min(1),
      })
    )
    .default([]),
});

export const registerSchema = z.object({
  email: z.string().email("Neplatný email"),
  username: z
    .string()
    .min(3, "Username musí mít alespoň 3 znaky")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Pouze písmena, čísla a podtržítko"),
  password: z
    .string()
    .min(8, "Heslo musí mít alespoň 8 znaků")
    .regex(/[A-Z]/, "Heslo musí obsahovat alespoň jedno velké písmeno")
    .regex(/[a-z]/, "Heslo musí obsahovat alespoň jedno malé písmeno")
    .regex(/[0-9]/, "Heslo musí obsahovat alespoň jednu číslici")
    .regex(/[^A-Za-z0-9]/, "Heslo musí obsahovat alespoň jeden speciální znak"),
});

export const loginSchema = z.object({
  email: z.string().email("Neplatný email"),
  password: z.string().min(1, "Heslo je povinné"),
});
