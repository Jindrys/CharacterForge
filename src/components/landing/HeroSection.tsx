"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const characters = [
  {
    name: "Arintal",
    subtitle: "Half-elf - bard",
    image: "/characters/arintal.png",
  },
  {
    name: "Hordur",
    subtitle: "Dwarf - cleric",
    image: "/characters/hordur.png",
  },
  {
    name: "Narcelia",
    subtitle: "Drow - rogue",
    image: "/characters/narcelia.png",
  },
  {
    name: "Syrien",
    subtitle: "Human - ranger",
    image: "/characters/syrien.png",
  },
];

export function HeroSection() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % characters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getPosition = (index: number) => {
    const diff = (index - active + characters.length) % characters.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === characters.length - 1) return "left";
    return "hidden";
  };

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden border-b border-gray-800">
      {/* Pozadí */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-950/30 via-gray-950 to-gray-950" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full flex items-center gap-16 py-20">
        {/* Text */}
        <div className="flex-1 max-w-xl">
          <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-5">
            ✦ CharacterForge
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Vítej ve světě
            <br />
            <span className="text-amber-400">tvých hrdinů</span>
            <br />a fantazie
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Dej život svým postavám. Vytvárej hrdiny, zaznamenávej jejich
            příběhy a sdílej je s komunitou dobrodruhů.
          </p>
          <div className="flex gap-4">
            <Link
              href="/register"
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
            >
              Začít zdarma
            </Link>
            <Link
              href="/community"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-xl transition-all"
            >
              Procházet postavy
            </Link>
          </div>
        </div>

        {/* Slide postav */}
        <div className="hidden lg:flex items-center justify-center flex-1 h-72">
          <AnimatePresence mode="wait">
            {characters.map((char, index) =>
              index === active ? (
                <motion.div
                  key={char.name}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-4"
                >
                  <img
                    src={char.image}
                    alt={char.name}
                    className="h-80 w-auto object-contain"
                  />

                  <div className="text-center">
                    <div className="text-white text-2xl font-bold">
                      {char.name}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      {char.subtitle}
                    </div>
                    <div className="text-amber-400 text-xs mt-2 uppercase tracking-widest">
                      Úroveň 8
                    </div>
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indikátory */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {characters.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1 rounded-full transition-all ${
              i === active ? "w-6 bg-amber-500" : "w-2 bg-gray-700"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
