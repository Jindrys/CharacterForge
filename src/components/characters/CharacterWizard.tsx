"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { WizardProgress } from "./WizardProgress";
import { StepBasics } from "./StepBasics";
import { StepStats } from "./StepStats";
import { StepEquipment } from "./StepEquipment";
import type { CharacterFormData } from "@/types";
import { ArrowLeft, ArrowRight, Wand2 } from "lucide-react";

const defaultData: CharacterFormData = {
  name: "",
  race: "",
  class: "",
  level: 1,
  backstory: "",
  avatarUrl: "",
  isPublic: false,
  stats: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    maxHp: 10,
    currentHp: 10,
    armorClass: 10,
    speed: 30,
    initiative: 0,
  },
  equipment: [],
};

type Props = {
  initialData?: CharacterFormData;
  characterId?: string;
};

export function CharacterWizard({ initialData, characterId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CharacterFormData>(
    initialData ?? defaultData
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateData(partial: Partial<CharacterFormData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function validateStep() {
    if (step === 1) {
      if (!data.name.trim()) {
        setError("Jméno je povinné");
        return false;
      }
      if (!data.race.trim()) {
        setError("Rasa je povinná");
        return false;
      }
      if (!data.class.trim()) {
        setError("Třída je povinná");
        return false;
      }
    }
    setError("");
    return true;
  }

  function nextStep() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 3));
  }

  function prevStep() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      const url = characterId
        ? `/api/characters/${characterId}`
        : "/api/characters";

      const res = await fetch(url, {
        method: characterId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Chyba při ukládání");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Chyba při ukládání");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <WizardProgress currentStep={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 && <StepBasics data={data} onChange={updateData} />}
          {step === 2 && <StepStats data={data} onChange={updateData} />}
          {step === 3 && <StepEquipment data={data} onChange={updateData} />}
        </motion.div>
      </AnimatePresence>

      {error && (
        <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Navigace */}
      <div className="flex justify-between">
        <button
          onClick={step === 1 ? () => router.push("/dashboard") : prevStep}
          className="flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? "Zrušit" : "Zpět"}
        </button>

        {step < 3 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            Pokračovat
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-950 font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            <Wand2 className="w-4 h-4" />
            {loading
              ? "Ukládám..."
              : characterId
              ? "Uložit změny"
              : "Vytvořit postavu"}
          </button>
        )}
      </div>
    </div>
  );
}
