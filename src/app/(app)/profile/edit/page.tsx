"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Upload, X, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type ProfileData = {
  username: string;
  bio: string;
  avatarUrl: string;
  email: string;
  instagram: string;
  twitter: string;
  discord: string;
};

export default function EditProfilePage() {
  const router = useRouter();
  const { update } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<ProfileData>({
    username: "",
    bio: "",
    avatarUrl: "",
    email: "",
    instagram: "",
    twitter: "",
    discord: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/users/profile");
      const profile = await res.json();
      setData({
        username: profile.username || "",
        bio: profile.bio || "",
        avatarUrl: profile.avatarUrl || "",
        email: profile.email || "",
        instagram: profile.instagram || "",
        twitter: profile.twitter || "",
        discord: profile.discord || "",
      });
      if (profile.avatarUrl) setPreview(profile.avatarUrl);
    }
    fetchProfile();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        setData((prev) => ({ ...prev, avatarUrl: result.url }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
          instagram: data.instagram,
          twitter: data.twitter,
          discord: data.discord,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error);
        return;
      }

      await update({ username: result.username, avatarUrl: result.avatarUrl });
      toast.success("Profil byl uložen!");
      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch {
      setError("Chyba při ukládání");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Hesla se neshodují");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setPasswordError(result.error);
        return;
      }

      toast.success("Heslo bylo změněno!");
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setPasswordError("Chyba při změně hesla");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Zpět */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na dashboard
        </Link>

        {/* Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-6">
          <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-2">
            Nastavení
          </div>
          <div className="text-2xl font-bold text-white">Upravit profil</div>
        </div>

        {/* Profil form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-700 hover:border-amber-600 flex items-center justify-center overflow-hidden cursor-pointer transition-colors relative group shrink-0"
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                  </>
                ) : (
                  <Upload className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div>
                <div className="text-white font-medium mb-1">
                  Profilový avatar
                </div>
                <div className="text-gray-400 text-sm mb-2">
                  Nahraj profilový obrázek
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="text-xs border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {uploading ? "Nahrávám..." : "Nahrát obrázek"}
                  </button>
                  {preview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setData((prev) => ({ ...prev, avatarUrl: "" }));
                      }}
                      className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3 h-3" /> Odebrat
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800" />

            {/* Email readonly */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={data.email}
                disabled
                className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
              />
              <p className="text-gray-600 text-xs">Email nelze změnit</p>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                value={data.username}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, username: e.target.value }))
                }
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                placeholder="dobrodruh123"
              />
              <p className="text-gray-500 text-xs">
                Pouze písmena, čísla a podtržítko
              </p>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Bio</label>
              <textarea
                value={data.bio}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={4}
                maxLength={300}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
                placeholder="Napiš něco o sobě..."
              />
              <p className="text-gray-500 text-xs text-right">
                {data.bio.length}/300
              </p>
            </div>
            {/* Sociální sítě */}
            <div className="border-t border-gray-800 pt-6">
              <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-5">
                Sociální sítě
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <span>Instagram</span>
                  </label>
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:border-amber-500 transition-colors">
                    <span className="px-4 text-gray-500 text-sm border-r border-gray-700 py-3">
                      @
                    </span>
                    <input
                      type="text"
                      value={data.instagram}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          instagram: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm"
                      placeholder="tvuj_profil"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    <span>Twitter / X</span>
                  </label>
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:border-amber-500 transition-colors">
                    <span className="px-4 text-gray-500 text-sm border-r border-gray-700 py-3">
                      @
                    </span>
                    <input
                      type="text"
                      value={data.twitter}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          twitter: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm"
                      placeholder="tvuj_profil"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    <span>Discord</span>
                  </label>
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:border-amber-500 transition-colors">
                    <span className="px-4 text-gray-500 text-sm border-r border-gray-700 py-3 whitespace-nowrap">
                      discord.gg/
                    </span>
                    <input
                      type="text"
                      value={data.discord}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          discord: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm"
                      placeholder="tvuj_server"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                Profil byl úspěšně uložen!
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Link
                href="/dashboard"
                className="flex-1 text-center border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl transition-all text-sm font-medium"
              >
                Zrušit
              </Link>
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-950 font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] text-sm"
              >
                {loading ? "Ukládám..." : "Uložit změny"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Změna hesla */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
        >
          <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-6">
            Změna hesla
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Současné heslo
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Nové heslo
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                placeholder="••••••••"
              />
              <p className="text-gray-500 text-xs">
                Min. 8 znaků, velké i malé písmeno, číslo a speciální znak
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Potvrdit nové heslo
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {passwordError && (
              <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                Heslo bylo úspěšně změněno!
              </div>
            )}

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm border border-gray-700"
            >
              {passwordLoading ? "Měním heslo..." : "Změnit heslo"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
