"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sword } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Nesprávný email nebo heslo");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="h-[90vh] flex">
      {/* Levá strana — postava */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Gradient pozadí */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-950 via-gray-900 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />

        {/* Postava */}
        <div className="relative flex flex-col items-center justify-end w-full pb-16">
          <motion.img
            src="/characters/narcelia.png"
            alt="Narcelia"
            className="h-[70vh] w-auto object-contain drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Info o postavě */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-10 left-0 right-0 text-center"
          >
            <div className="text-white font-bold text-xl">Narcelia</div>
            <div className="text-amber-400 text-sm mt-1">Drow · Rogue</div>
          </motion.div>

          {/* Spodní citát */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-gray-950 to-transparent h-32"
          />
        </div>
      </div>

      {/* Pravá strana — formulář */}
      <div className="flex-1 flex items-center justify-center px-8 bg-gray-950">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
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
            <h1 className="text-3xl font-bold text-white mb-2">Vítej zpět</h1>
            <p className="text-gray-400 mb-8">Pokračuj ve svém dobrodružství</p>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  Heslo
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] mt-2"
              >
                {loading ? "Přihlašuji..." : "Přihlásit se"}
              </button>
            </form>

            <p className="text-center text-gray-400 mt-6 text-sm">
              Nemáš účet?{" "}
              <Link
                href="/register"
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                Registruj se
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
