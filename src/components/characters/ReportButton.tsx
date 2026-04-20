"use client";

import { useState } from "react";
import { Flag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  characterId: string;
};

export function ReportButton({ characterId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess(true);
      setReason("");
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2000);
    } catch {
      setError("Chyba při odesílání");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors"
      >
        <Flag className="w-3.5 h-3.5" />
        Nahlásit
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 bg-gray-950/80 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="text-white font-semibold">Nahlásit postavu</div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setError("");
                    setReason("");
                  }}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {success ? (
                <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-3 rounded-xl text-sm text-center">
                  Postava byla nahlášena. Děkujeme!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">
                      Důvod nahlášení
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={4}
                      required
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none text-sm"
                      placeholder="Popiš proč hlásíš tuto postavu..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setError("");
                        setReason("");
                      }}
                      className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-300 py-2.5 rounded-xl text-sm transition-colors"
                    >
                      Zrušit
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !reason.trim()}
                      className="flex-1 bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
                    >
                      {loading ? "Odesílám..." : "Nahlásit"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
