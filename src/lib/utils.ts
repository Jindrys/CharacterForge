import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generování unikátního slugu pro postavu
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${random}`;
}

// Výpočet modifikátoru statistiky (D&D pravidla)
export function getStatModifier(stat: number): number {
  return Math.floor((stat - 10) / 2);
}

// Formátování modifikátoru s znaménkem
export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
