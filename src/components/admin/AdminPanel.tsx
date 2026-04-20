"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Flag, Trash2, Shield, ShieldOff, Check } from "lucide-react";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  username: string;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  _count: { characters: number };
};

type Report = {
  id: string;
  reason: string;
  resolved: boolean;
  createdAt: string;
  reporter: { id: string; username: string };
  character: {
    id: string;
    name: string;
    slug: string;
    owner: { username: string };
  };
};

export function AdminPanel() {
  const [tab, setTab] = useState<"users" | "reports">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [tab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (tab === "users") {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data);
      } else {
        const res = await fetch("/api/admin/reports");
        const data = await res.json();
        setReports(data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Opravdu smazat uživatele?")) return;
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    const updated = await res.json();
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
    );
  }

  async function deleteCharacter(characterId: string) {
    if (!confirm("Opravdu smazat postavu?")) return;
    await fetch("/api/admin/characters", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId }),
    });
    fetchData();
  }

  async function resolveReport(reportId: string) {
    await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId }),
    });
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, resolved: true } : r))
    );
  }

  const unresolvedCount = reports.filter((r) => !r.resolved).length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1 flex gap-1">
        <button
          onClick={() => setTab("users")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            tab === "users"
              ? "bg-amber-500 text-gray-950"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          Uživatelé ({users.length})
        </button>
        <button
          onClick={() => setTab("reports")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            tab === "reports"
              ? "bg-amber-500 text-gray-950"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Flag className="w-4 h-4" />
          Nahlášení
          {unresolvedCount > 0 && (
            <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {unresolvedCount}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Načítám...</div>
      ) : tab === "users" ? (
        /* UŽIVATELÉ */
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Uživatel
                </th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Postavy
                </th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Registrace
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-700 overflow-hidden shrink-0 flex items-center justify-center">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm font-bold">
                            {user.username[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {user.username}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        user.role === "ADMIN"
                          ? "text-amber-400 border-amber-800 bg-amber-950"
                          : "text-gray-400 border-gray-700 bg-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {user._count.characters}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("cs-CZ")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => toggleRole(user.id, user.role)}
                        className="p-1.5 text-gray-500 hover:text-amber-400 transition-colors"
                        title={
                          user.role === "ADMIN"
                            ? "Odebrat admin roli"
                            : "Přidat admin roli"
                        }
                      >
                        {user.role === "ADMIN" ? (
                          <ShieldOff className="w-4 h-4" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* NAHLÁŠENÍ */
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Žádná nahlášení
            </div>
          ) : (
            reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gray-900 border rounded-2xl p-5 ${
                  report.resolved
                    ? "border-gray-800 opacity-60"
                    : "border-red-900"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/hero/${report.character.slug}`}
                        className="text-white font-medium hover:text-amber-400 transition-colors"
                      >
                        {report.character.name}
                      </Link>
                      <span className="text-gray-500 text-xs">
                        od {report.character.owner.username}
                      </span>
                      {report.resolved && (
                        <span className="text-xs text-green-400 border border-green-800 bg-green-950 px-2 py-0.5 rounded-full">
                          Vyřešeno
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      {report.reason}
                    </p>
                    <div className="text-gray-500 text-xs">
                      Nahlásil: {report.reporter.username} ·{" "}
                      {new Date(report.createdAt).toLocaleDateString("cs-CZ")}
                    </div>
                  </div>
                  {!report.resolved && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => deleteCharacter(report.character.id)}
                        className="flex items-center gap-1.5 text-xs bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Smazat postavu
                      </button>
                      <button
                        onClick={() => resolveReport(report.id)}
                        className="flex items-center gap-1.5 text-xs bg-green-950 hover:bg-green-900 text-green-400 border border-green-800 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Vyřešit
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
