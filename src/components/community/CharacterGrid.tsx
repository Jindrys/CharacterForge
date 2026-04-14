"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Shield } from "lucide-react";
import type { CharacterWithRelations } from "@/types";

type Props = {
  characters: CharacterWithRelations[];
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

export function CharacterGrid({
  characters,
  page,
  pages,
  onPageChange,
}: Props) {
  if (characters.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        <div className="text-4xl mb-4">⚔️</div>
        <div className="text-lg text-gray-400 mb-2">
          Žádné postavy nenalezeny
        </div>
        <div className="text-sm">Zkus upravit filtry nebo vyhledávání</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {characters.map((character, i) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link href={`/hero/${character.slug}`}>
              <div className="bg-gray-900 border border-gray-800 hover:border-amber-800 rounded-2xl overflow-hidden cursor-pointer group transition-colors">
                {/* Avatar */}
                <div className="h-36 bg-gray-800 flex items-center justify-center overflow-hidden">
                  {character.avatarUrl ? (
                    <img
                      src={character.avatarUrl}
                      alt={character.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-amber-900 border border-amber-700 flex items-center justify-center text-amber-300 font-bold text-xl">
                      {character.name[0]}
                    </div>
                  )}
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

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-gray-500 text-xs">
                      od {character.owner.username}
                    </span>
                    {character.stats && (
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 text-red-400 text-xs">
                          <Heart className="w-3 h-3" />
                          {character.stats.maxHp}
                        </div>
                        <div className="flex items-center gap-1 text-blue-400 text-xs">
                          <Shield className="w-3 h-3" />
                          {character.stats.armorClass}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white disabled:opacity-40 transition-colors"
          >
            ←
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
            .map((p, i, arr) => (
              <div key={p} className="flex items-center gap-2">
                {i > 0 && arr[i - 1] !== p - 1 && (
                  <span className="text-gray-600 text-sm">...</span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-amber-500 text-gray-950"
                      : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              </div>
            ))}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
            className="w-9 h-9 flex items-center justify-center bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white disabled:opacity-40 transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
