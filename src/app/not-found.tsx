import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Číslo */}
        <div className="relative">
          <div className="text-[120px] font-bold text-gray-800 leading-none select-none">
            404
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Stránka nenalezena
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Tato stránka neexistuje nebo byla odstraněna. Možná jsi zabloudil v
            temných kobkách.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            Zpět domů
          </Link>
          <Link
            href="/community"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl transition-all"
          >
            Procházet postavy
          </Link>
        </div>
      </div>
    </div>
  );
}
