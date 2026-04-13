"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Heart } from "lucide-react";
import type { CharacterWithRelations } from "@/types";

type Props = {
  character: CharacterWithRelations;
};

export function CharacterCard({ character }: Props) {
  return (
    <Link href={`/hero/${character.slug}`}>
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.2 }}
        className="relative min-w-40 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer shrink-0 group"
      >
        {/* Avatar */}
        <div className="h-30 bg-gray-800 flex items-center justify-center overflow-hidden">
          {character.avatarUrl ? (
            <motion.img
              src={character.avatarUrl}
              alt={character.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-amber-900 border border-amber-700 flex items-center justify-center text-amber-300 font-bold text-xl">
              {character.name[0]}
            </div>
          )}
        </div>

        {/* Info — vždy viditelné */}
        <div className="p-3">
          <div className="text-white text-sm font-medium truncate">
            {character.name}
          </div>
          <div className="text-gray-400 text-xs mt-0.5">
            {character.race} · {character.class}
          </div>
          <div className="text-amber-400 text-xs mt-1">
            Lvl {character.level}
          </div>
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gray-950/90 flex flex-col justify-center items-center gap-3 p-4"
        >
          <div className="text-white text-sm font-medium">{character.name}</div>
          <div className="text-gray-400 text-xs">
            {character.owner.username}
          </div>
          {character.stats && (
            <div className="flex gap-3 mt-1">
              <div className="flex items-center gap-1 text-red-400 text-xs">
                <Heart className="w-3 h-3" />
                {character.stats.maxHp} HP
              </div>
              <div className="flex items-center gap-1 text-blue-400 text-xs">
                <Shield className="w-3 h-3" />
                {character.stats.armorClass} AC
              </div>
            </div>
          )}
          <div className="text-amber-400 text-xs mt-1 border border-amber-800 px-2 py-0.5 rounded-full">
            Zobrazit postavu →
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
