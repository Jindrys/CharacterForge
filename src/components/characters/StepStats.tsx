"use client";

import type { CharacterFormData } from "@/types";
import { getStatModifier, formatModifier } from "@/lib/utils";

type Props = {
  data: CharacterFormData;
  onChange: (data: Partial<CharacterFormData>) => void;
};

const mainStats = [
  { key: "strength", label: "STR" },
  { key: "dexterity", label: "DEX" },
  { key: "constitution", label: "CON" },
  { key: "intelligence", label: "INT" },
  { key: "wisdom", label: "WIS" },
  { key: "charisma", label: "CHA" },
] as const;

const combatStats = [
  { key: "maxHp", label: "Max HP" },
  { key: "currentHp", label: "Aktuální HP" },
  { key: "armorClass", label: "Armor Class" },
  { key: "speed", label: "Rychlost (ft)" },
  { key: "initiative", label: "Iniciativa" },
] as const;

export function StepStats({ data, onChange }: Props) {
  function updateStat(key: string, value: number) {
    onChange({
      stats: {
        ...data.stats,
        [key]: value,
      },
    });
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-8">
      <div className="text-amber-500 text-xs font-medium uppercase tracking-widest">
        Statistiky
      </div>

      {/* Hlavní statistiky */}
      <div>
        <div className="text-gray-400 text-sm mb-4">Základní vlastnosti</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {mainStats.map(({ key, label }) => {
            const value = data.stats[key];
            const mod = getStatModifier(value);
            return (
              <div
                key={key}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex flex-col items-center gap-2"
              >
                <div className="text-gray-400 text-xs font-medium">{label}</div>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={value}
                  onChange={(e) =>
                    updateStat(key, parseInt(e.target.value) || 1)
                  }
                  className="w-full text-center text-2xl font-bold text-white bg-transparent border-none focus:outline-none focus:ring-0"
                />
                <div
                  className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    mod >= 0
                      ? "text-green-400 bg-green-950"
                      : "text-red-400 bg-red-950"
                  }`}
                >
                  {formatModifier(mod)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bojové statistiky */}
      <div>
        <div className="text-gray-400 text-sm mb-4">Bojové statistiky</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {combatStats.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">{label}</label>
              <input
                type="number"
                min={0}
                value={data.stats[key]}
                onChange={(e) => updateStat(key, parseInt(e.target.value) || 0)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
