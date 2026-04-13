import Link from "next/link";
import { Shield, Heart } from "lucide-react";
import type { CharacterWithRelations } from "@/types";

type Props = {
  character: CharacterWithRelations;
};

export function TopCharacter({ character }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-5">
      <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-4">
        Nejpopulárnější postava
      </div>
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden shrink-0">
          {character.avatarUrl ? (
            <img
              src={character.avatarUrl}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-xl">
              {character.name[0]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="text-white font-semibold text-lg">
            {character.name}
          </div>
          <div className="text-gray-400 text-sm mt-0.5">
            {character.race} · {character.class} · Lvl {character.level}
          </div>
          {character.stats && (
            <div className="flex gap-4 mt-2">
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
        </div>

        <Link
          href={`/characters/${character.slug}`}
          className="text-amber-400 hover:text-amber-300 text-sm border border-amber-800 hover:border-amber-600 px-4 py-2 rounded-xl transition-colors"
        >
          Zobrazit →
        </Link>
      </div>
    </div>
  );
}
