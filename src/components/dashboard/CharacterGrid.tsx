"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, Pencil, Eye, Lock, Globe } from "lucide-react";
import type { CharacterWithRelations } from "@/types";

type Props = {
  characters: CharacterWithRelations[];
};

export function CharacterGrid({ characters }: Props) {
  const showAddCard = characters.length < 4;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-amber-500 text-xs font-medium uppercase tracking-widest">
          Moje postavy
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-xs">
            {characters.length} postav
          </span>
          {!showAddCard && (
            <Link
              href="/characters/new"
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 border border-amber-800 hover:border-amber-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Nová postava
            </Link>
          )}
        </div>
      </div>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-4">⚔️</div>
          <div className="text-white font-medium mb-2">Zatím žádné postavy</div>
          <div className="text-gray-400 text-sm mb-6">
            Vytvoř svého prvního hrdinu
          </div>
          <Link
            href="/characters/new"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Vytvořit postavu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {characters.map((character, i) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden group"
            >
              {/* Avatar */}
              <div className="h-48 bg-gray-700 flex items-center justify-center overflow-hidden relative">
                {character.avatarUrl ? (
                  <img
                    src={character.avatarUrl}
                    alt={character.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-3xl font-bold text-gray-500">
                    {character.name[0]}
                  </div>
                )}
                {/* Veřejná/soukromá badge */}
                <div
                  className={`absolute top-2 right-2 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                    character.isPublic
                      ? "bg-green-950 text-green-400 border border-green-800"
                      : "bg-gray-900 text-gray-400 border border-gray-700"
                  }`}
                >
                  {character.isPublic ? (
                    <>
                      <Globe className="w-3 h-3" /> Veřejná
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" /> Soukromá
                    </>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="text-white font-medium truncate">
                  {character.name}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {character.race} · {character.class}
                </div>
                <div className="text-amber-400 text-xs mt-1">
                  Lvl {character.level}
                </div>

                {/* Akce */}
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/characters/${character.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white py-2 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    Upravit
                  </Link>
                  <Link
                    href={`/hero/${character.slug}`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white py-2 rounded-lg transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    Zobrazit
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Velká + karta pro 0-3 postavy */}
          {showAddCard && (
            <Link href="/characters/new">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: characters.length * 0.05 }}
                className="h-full min-h-50 bg-gray-800/50 border border-dashed border-gray-700 hover:border-amber-700 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full border border-dashed border-gray-600 group-hover:border-amber-600 flex items-center justify-center transition-colors">
                  <PlusCircle className="w-5 h-5 text-gray-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="text-gray-500 group-hover:text-amber-400 text-sm transition-colors">
                  Nová postava
                </div>
              </motion.div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
