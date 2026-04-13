"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CharacterFormData } from "@/types";

type EquipmentItem = CharacterFormData["equipment"][number];

type Props = {
  data: CharacterFormData;
  onChange: (data: Partial<CharacterFormData>) => void;
};

const emptyItem: EquipmentItem = {
  name: "",
  type: "item",
  description: "",
  quantity: 1,
};

export function StepEquipment({ data, onChange }: Props) {
  const [newItem, setNewItem] = useState<EquipmentItem>({ ...emptyItem });

  function addItem() {
    if (!newItem.name.trim()) return;
    onChange({ equipment: [...data.equipment, newItem] });
    setNewItem({ ...emptyItem });
  }

  function removeItem(index: number) {
    onChange({ equipment: data.equipment.filter((_, i) => i !== index) });
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
      <div className="text-amber-500 text-xs font-medium uppercase tracking-widest">
        Vybavení
      </div>

      {/* Seznam předmětů */}
      {data.equipment.length > 0 && (
        <div className="space-y-2">
          {data.equipment.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
            >
              <div className="flex-1 text-white text-sm font-medium">
                {item.name}
              </div>
              <div
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  item.type === "weapon"
                    ? "text-red-400 border-red-800 bg-red-950"
                    : item.type === "armor"
                    ? "text-blue-400 border-blue-800 bg-blue-950"
                    : "text-gray-400 border-gray-700 bg-gray-800"
                }`}
              >
                {item.type === "weapon"
                  ? "Zbraň"
                  : item.type === "armor"
                  ? "Zbroj"
                  : "Předmět"}
              </div>
              <div className="text-gray-400 text-xs">{item.quantity}x</div>
              <button
                onClick={() => removeItem(i)}
                className="text-gray-600 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Přidat předmět */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
        <div className="text-gray-300 text-sm font-medium">Přidat předmět</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Název *</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Krátký meč"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Typ</label>
            <select
              value={newItem.type}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  type: e.target.value as EquipmentItem["type"],
                })
              }
              className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="weapon">Zbraň</option>
              <option value="armor">Zbroj</option>
              <option value="item">Předmět</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Množství</label>
            <input
              type="number"
              min={1}
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
              className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Popis</label>
            <input
              type="text"
              value={newItem.description || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Volitelný popis"
            />
          </div>
        </div>
        <button
          onClick={addItem}
          disabled={!newItem.name.trim()}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-gray-950 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Přidat
        </button>
      </div>

      {data.equipment.length === 0 && (
        <div className="text-center py-6 text-gray-600 text-sm">
          Zatím žádné vybavení — přidej první předmět výše
        </div>
      )}
    </div>
  );
}
