"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

type FilterState = {
  search: string;
  race: string;
  class: string;
  minLevel: number;
  maxLevel: number;
  sort: string;
  limit: number;
};

type Props = {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  total: number;
};

const sortOptions = [
  { value: "newest", label: "Nejnovější" },
  { value: "oldest", label: "Nejstarší" },
  { value: "level_desc", label: "Úroveň ↓" },
  { value: "level_asc", label: "Úroveň ↑" },
];

const limitOptions = [32, 64, 128, 256];

export function Filters({ filters, onChange, total }: Props) {
  const hasActiveFilters =
    filters.race ||
    filters.class ||
    filters.minLevel > 1 ||
    filters.maxLevel < 20;

  function resetFilters() {
    onChange({ race: "", class: "", minLevel: 1, maxLevel: 20, search: "" });
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
      {/* Search + Sort + Limit */}
      <div className="flex gap-3">
        {/* Search */}
        <div className="flex-1 flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Hledat podle jména nebo autora..."
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
          />
          {filters.search && (
            <button onClick={() => onChange({ search: "" })}>
              <X className="w-4 h-4 text-gray-500 hover:text-white transition-colors" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <select
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value })}
              className="bg-transparent text-gray-300 text-sm focus:outline-none cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-gray-800">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Limit */}
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5">
          <select
            value={filters.limit}
            onChange={(e) => onChange({ limit: parseInt(e.target.value) })}
            className="bg-transparent text-gray-300 text-sm focus:outline-none cursor-pointer"
          >
            {limitOptions.map((l) => (
              <option key={l} value={l} className="bg-gray-800">
                {l} postav
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtry */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-gray-500">Filtry:</span>

        {/* Třída */}
        <input
          type="text"
          value={filters.class}
          onChange={(e) => onChange({ class: e.target.value })}
          placeholder="Třída"
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors w-28"
        />

        {/* Rasa */}
        <input
          type="text"
          value={filters.race}
          onChange={(e) => onChange({ race: e.target.value })}
          placeholder="Rasa"
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors w-28"
        />

        {/* Úroveň */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Lvl</span>
          <input
            type="number"
            min={1}
            max={20}
            value={filters.minLevel}
            onChange={(e) =>
              onChange({ minLevel: parseInt(e.target.value) || 1 })
            }
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors w-14 text-center"
          />
          <span className="text-xs text-gray-500">—</span>
          <input
            type="number"
            min={1}
            max={20}
            value={filters.maxLevel}
            onChange={(e) =>
              onChange({ maxLevel: parseInt(e.target.value) || 20 })
            }
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors w-14 text-center"
          />
        </div>

        {/* Aktivní filtry tagy */}
        {filters.class && (
          <div className="flex items-center gap-1.5 bg-amber-950 border border-amber-800 text-amber-400 text-xs px-2.5 py-1 rounded-full">
            {filters.class}
            <button onClick={() => onChange({ class: "" })}>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {filters.race && (
          <div className="flex items-center gap-1.5 bg-amber-950 border border-amber-800 text-amber-400 text-xs px-2.5 py-1 rounded-full">
            {filters.race}
            <button onClick={() => onChange({ race: "" })}>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-gray-500 hover:text-white transition-colors ml-auto"
          >
            Zrušit filtry
          </button>
        )}
      </div>

      {/* Počet výsledků */}
      <div className="text-xs text-gray-500">Nalezeno {total} postav</div>
    </div>
  );
}
