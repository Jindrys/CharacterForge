import { BookOpen, User } from "lucide-react";

export function ForWhom() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* DM karta */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-900 transition-colors">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-amber-950 border border-amber-900 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-white font-semibold text-lg">Dungeon Master</div>
              <div className="text-amber-500 text-sm">Hledáš NPC pro svou kampaň?</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Procházej stovky detailně zpracovaných postav od komunity. Najdi perfektního obchodníka, záporáka nebo spojence — a rovnou ho použij jako NPC ve své hře.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Hledat podle rasy", "Hledat podle třídy", "Filtrovat podle úrovně"].map((tag) => (
              <span key={tag} className="text-xs bg-amber-950 text-amber-400 border border-amber-900 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hráč karta */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-purple-900 transition-colors">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-purple-950 border border-purple-900 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-white font-semibold text-lg">Hráč</div>
              <div className="text-purple-400 text-sm">Nevíš kde začít?</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Nechej se inspirovat postavami ostatních hráčů. Prohlédni si jejich statistiky, příběhy a vybavení — a pak vytvoř vlastního hrdinu, který bude čistě tvůj.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Procházet postavy", "Vytvořit postavu", "Sdílet příběh"].map((tag) => (
              <span key={tag} className="text-xs bg-purple-950 text-purple-400 border border-purple-900 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}