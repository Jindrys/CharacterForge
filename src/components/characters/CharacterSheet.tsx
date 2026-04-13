"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Shield, Zap, Footprints, ArrowLeft, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { getStatModifier, formatModifier } from "@/lib/utils";
import type { CharacterWithRelations } from "@/types";

type Props = {
  character: CharacterWithRelations & {
    history: { id: string; note: string; createdAt: Date }[];
  };
  isOwner: boolean;
};

const statLabels = [
  { key: "strength", label: "STR" },
  { key: "dexterity", label: "DEX" },
  { key: "constitution", label: "CON" },
  { key: "intelligence", label: "INT" },
  { key: "wisdom", label: "WIS" },
  { key: "charisma", label: "CHA" },
] as const;

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `před ${mins} min`;
  if (hours < 24) return `před ${hours} hod`;
  return `před ${days} dny`;
}

export function CharacterSheet({ character, isOwner }: Props) {
  const router = useRouter();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Zpět */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zpět
      </button>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
      >
        <div className="px-8 pb-8">
          {/* Avatar + info */}
          <div className="flex items-end gap-6 mt-12 mb-6">
            <div className="w-28 h-36 bg-gray-800 border-4 border-gray-900 rounded-2xl overflow-hidden shrink-0">
              {character.avatarUrl ? (
                <img
                  src={character.avatarUrl}
                  alt={character.name}
                  className="w-full h-full object-contain scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500">
                  {character.name[0]}
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-3xl font-bold text-white">
                {character.name}
              </h1>
              <div className="text-gray-400 text-sm mt-1">
                {character.race} · {character.class}
              </div>
              <div className="text-amber-400 text-sm mt-0.5">
                Úroveň {character.level}
              </div>
              <div className="flex items-center gap-3 mt-2">
                {isOwner && (
                  <Link
                    href={`/characters/${character.id}/edit`}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
                  >
                    Upravit postavu
                  </Link>
                )}

                <span className="text-xs bg-purple-950 text-purple-400 border border-purple-800 px-2.5 py-0.5 rounded-full">
                  Veřejná
                </span>
                <Link
                  href={`/profile/${character.owner.username}`}
                  className="text-xs text-gray-500 hover:text-amber-400 transition-colors"
                >
                  od {character.owner.username}
                </Link>
              </div>
            </div>
          </div>

          {/* Rychlé stats */}
          {character.stats && (
            <div className="flex flex-wrap gap-3">
              <StatBadge
                icon={<Heart className="w-3.5 h-3.5 text-red-400" />}
                label="HP"
                value={`${character.stats.currentHp}/${character.stats.maxHp}`}
              />
              <StatBadge
                icon={<Shield className="w-3.5 h-3.5 text-blue-400" />}
                label="AC"
                value={character.stats.armorClass}
              />
              <StatBadge
                icon={<Footprints className="w-3.5 h-3.5 text-teal-400" />}
                label="Speed"
                value={`${character.stats.speed} ft`}
              />
              <StatBadge
                icon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
                label="Initiative"
                value={formatModifier(character.stats.initiative)}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* HLAVNÍ OBSAH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Levý sloupec */}
        <div className="space-y-6">
          {/* Vlastnosti */}
          {character.stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
            >
              <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-5">
                Vlastnosti
              </div>
              <div className="grid grid-cols-3 gap-3">
                {statLabels.map(({ key, label }) => {
                  const value = character.stats![key];
                  const mod = getStatModifier(value);
                  return (
                    <div
                      key={key}
                      className="bg-gray-800 rounded-xl p-3 flex flex-col items-center gap-2"
                    >
                      <div className="text-gray-400 text-xs font-medium">
                        {label}
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {value}
                      </div>
                      <div
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          mod > 0
                            ? "text-green-400 bg-green-950"
                            : mod < 0
                            ? "text-red-400 bg-red-950"
                            : "text-gray-400 bg-gray-700"
                        }`}
                      >
                        {formatModifier(mod)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Vybavení */}
          {character.equipment.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
            >
              <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-5">
                Vybavení
              </div>
              <div className="space-y-2">
                {character.equipment.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3"
                  >
                    <div className="flex-1 text-white text-sm">{item.name}</div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        item.type === "weapon"
                          ? "text-red-400 border-red-800 bg-red-950"
                          : item.type === "armor"
                          ? "text-blue-400 border-blue-800 bg-blue-950"
                          : "text-teal-400 border-teal-800 bg-teal-950"
                      }`}
                    >
                      {item.type === "weapon"
                        ? "Zbraň"
                        : item.type === "armor"
                        ? "Zbroj"
                        : "Předmět"}
                    </span>
                    <div className="text-gray-500 text-xs">
                      {item.quantity}x
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Pravý sloupec */}
        <div className="space-y-6">
          {/* Příběh */}
          {character.backstory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
            >
              <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-5">
                Příběh
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {character.backstory}
              </p>
            </motion.div>
          )}

          {/* Historie */}
          {character.history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
            >
              <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-5">
                Historie změn
              </div>
              <div className="space-y-4">
                {character.history.map((entry) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                      <div className="w-0.5 bg-gray-800 flex-1" />
                    </div>
                    <div className="pb-4">
                      <div className="text-white text-sm">{entry.note}</div>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(entry.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBadge({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5">
      {icon}
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-base font-semibold">{value}</span>
    </div>
  );
}
