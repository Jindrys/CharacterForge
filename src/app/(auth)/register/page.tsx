"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sword, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Hesla se neshodují");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        username: formData.get("username"),
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="h-[90vh] flex">
      {/* Levá strana — postava */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-900 via-gray-900 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

        <div className="relative flex flex-col items-center justify-end w-full pb-16">
          <motion.img
            src="/characters/arintal.png"
            alt="Arintal"
            className="h-[70vh] w-auto object-contain drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-10 left-0 right-0 text-center"
          >
            <div className="text-white font-bold text-xl">Arintal</div>
            <div className="text-amber-400 text-sm mt-1">Half-elf · Bard</div>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-gray-950 to-transparent h-32" />
        </div>
      </div>

      {/* Pravá strana — formulář */}
      <div className="flex-1 flex items-center justify-center px-8 bg-gray-950 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Sword className="w-4 h-4 text-gray-950" />
              </div>
              <span className="font-bold text-white text-lg">
                CharacterForge
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Vytvoř účet</h1>
            <p className="text-gray-400 mb-8">Začni svou dobrodružnou cestu</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="tvuj@email.cz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="dobrodruh123"
                />
                <p className="text-gray-500 text-xs mt-1.5">
                  Pouze písmena, čísla a podtržítko
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Heslo
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="••••••••"
                />
                <p className="text-gray-500 text-xs mt-1.5">
                  Min. 8 znaků, velké i malé písmeno, číslo a speciální znak
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Potvrdit heslo
                </label>
                <input
                  name="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] mt-2"
              >
                {loading ? "Vytvářím účet..." : "Registrovat se"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-xs mb-3">Co získáš zdarma:</p>
              <div className="space-y-2">
                {[
                  "Neomezené množství postav",
                  "Sdílení s komunitou",
                  "Sledování vývoje postavy",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-gray-400 text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-gray-400 mt-6 text-sm">
              Už máš účet?{" "}
              <Link
                href="/login"
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                Přihlásit se
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
