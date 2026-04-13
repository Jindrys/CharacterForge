import { Check } from "lucide-react";

const steps = [
  { number: 1, label: "Základy" },
  { number: 2, label: "Statistiky" },
  { number: 3, label: "Vybavení" },
];

type Props = {
  currentStep: number;
};

export function WizardProgress({ currentStep }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="text-white font-semibold">Nová postava</div>
        <div className="text-gray-400 text-sm">Krok {currentStep} ze 3</div>
      </div>
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                  step.number < currentStep
                    ? "bg-amber-500 text-gray-950"
                    : step.number === currentStep
                    ? "bg-amber-500 text-gray-950 ring-4 ring-amber-500/20"
                    : "bg-gray-800 border border-gray-700 text-gray-500"
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>
              <div
                className={`text-xs font-medium ${
                  step.number <= currentStep
                    ? "text-amber-400"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 mb-5 transition-all ${
                  step.number < currentStep ? "bg-amber-500" : "bg-gray-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
