import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    default: "CharacterForge",
    template: "%s | CharacterForge",
  },
  description:
    "Vytvárej, sdílej a spravuj postavy pro stolní RPG hry jako Dungeons & Dragons. Komunita hráčů a Dungeon Masterů.",
  keywords: [
    "RPG",
    "D&D",
    "Dungeons and Dragons",
    "postavy",
    "character sheet",
    "fantasy",
  ],
  openGraph: {
    title: "CharacterForge",
    description: "Vytvárej, sdílej a spravuj postavy pro stolní RPG hry.",
    type: "website",
    locale: "cs_CZ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={geist.variable}>
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111827",
                border: "1px solid #1f2937",
                color: "#f9fafb",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
