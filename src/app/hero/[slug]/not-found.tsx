import Link from "next/link";
import { Sword } from "lucide-react";

export default function CharacterNotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Ikona */}
        <div className="relative">
          <div className="text-[120px] font-bold text-gray-800 leading-none select-none">
            404
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Postava nenalezena
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Hrdina možná padl v boji. Tato postava neexistuje, byla odstraněna
            nebo je soukromá.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/community"
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            Procházet postavy
          </Link>
          <Link
            href="/"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl transition-all"
          >
            Domů
          </Link>
        </div>
      </div>
    </div>
  );
}
