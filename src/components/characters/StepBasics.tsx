"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import type { CharacterFormData } from "@/types";

type Props = {
  data: CharacterFormData;
  onChange: (data: Partial<CharacterFormData>) => void;
};

export function StepBasics({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(data.avatarUrl || null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        onChange({ avatarUrl: data.url });
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-6">
        Základní informace
      </div>

      <div className="flex gap-8 items-start">
        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-28 h-36 bg-gray-800 border-2 border-dashed border-gray-700 hover:border-amber-600 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors overflow-hidden relative group"
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-500" />
                <div className="text-gray-500 text-xs text-center leading-tight">
                  {uploading ? "Nahrávám..." : "Nahrát\nobrázek"}
                </div>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {preview && (
            <button
              onClick={() => {
                setPreview(null);
                onChange({ avatarUrl: "" });
              }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" /> Odebrat
            </button>
          )}
          <div className="text-gray-600 text-xs">Max 5MB</div>
        </div>

        {/* Formulář */}
        <div className="flex-1 grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Jméno postavy *</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="Narcelia"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Úroveň *</label>
            <input
              type="number"
              min={1}
              max={20}
              value={data.level}
              onChange={(e) =>
                onChange({ level: parseInt(e.target.value) || 1 })
              }
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Rasa *</label>
            <input
              type="text"
              value={data.race}
              onChange={(e) => onChange({ race: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="Drow"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Třída *</label>
            <input
              type="text"
              value={data.class}
              onChange={(e) => onChange({ class: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="Rogue"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm text-gray-400">Příběh postavy</label>
            <textarea
              value={data.backstory || ""}
              onChange={(e) => onChange({ backstory: e.target.value })}
              rows={4}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
              placeholder="Napiš příběh své postavy..."
            />
          </div>

          {/* Toggle veřejná */}
          <div className="col-span-2 flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-5 py-4">
            <div>
              <div className="text-white font-medium">Veřejná postava</div>
              <div className="text-gray-400 text-sm mt-0.5">
                Ostatní uživatelé uvidí tuto postavu
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange({ isPublic: !data.isPublic })}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                data.isPublic ? "bg-amber-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  data.isPublic ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
