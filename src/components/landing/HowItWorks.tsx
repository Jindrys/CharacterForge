import { UserPlus, Wand2, Share2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Založ účet",
    description: "Registrace je zdarma a zabere ti méně než minutu.",
  },
  {
    number: "02",
    icon: Wand2,
    title: "Vytvoř postavu",
    description: "Editor tě provede vytvořením postavy krok za krokem.",
  },
  {
    number: "03",
    icon: Share2,
    title: "Sdílej s komunitou",
    description: "Zveřejni postavu a objevuj hrdiny ostatních hráčů.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-gray-800 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-12 text-center">
          Jak začít
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-amber-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-gray-950 text-xs font-bold">
                  {step.number.replace("0", "")}
                </div>
              </div>
              <div className="text-white font-semibold">{step.title}</div>
              <div className="text-gray-400 text-sm leading-relaxed">{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}