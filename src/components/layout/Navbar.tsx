"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Sword,
  Users,
  Search,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  X,
  Shield,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type SearchResult = {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  slug: string;
  avatarUrl: string | null;
  owner: { username: string };
};

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Zavři search při kliknutí mimo
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Vyhledávání s debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/community?search=${encodeURIComponent(searchQuery)}&limit=5`
        );
        const data = await res.json();
        setResults(data.characters || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  function handleSearchOpen() {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleResultClick(slug: string) {
    setSearchOpen(false);
    setSearchQuery("");
    setResults([]);
    router.push(`/hero/${slug}`);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors">
              <Sword className="w-4 h-4 text-gray-950" />
            </div>
            <span className="font-bold text-white text-lg">CharacterForge</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 w-72">
                  <Search className="w-4 h-4 text-gray-500 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hledat postavu nebo hráče..."
                    className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      setResults([]);
                    }}
                  >
                    <X className="w-4 h-4 text-gray-500 hover:text-white transition-colors" />
                  </button>
                </div>
              ) : (
                <NavIcon
                  onClick={handleSearchOpen}
                  icon={<Search className="w-5 h-5" />}
                  label="Hledat"
                />
              )}

              {/* Dropdown výsledky */}
              {searchOpen && searchQuery && (
                <div className="absolute top-12 left-0 w-72 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
                  {searching ? (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      Hledám...
                    </div>
                  ) : results.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      Žádné výsledky
                    </div>
                  ) : (
                    <div>
                      {results.map((char) => (
                        <button
                          key={char.id}
                          onClick={() => handleResultClick(char.slug)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gray-800 overflow-hidden shrink-0 flex items-center justify-center">
                            {char.avatarUrl ? (
                              <img
                                src={char.avatarUrl}
                                alt={char.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-gray-500 font-bold text-sm">
                                {char.name[0]}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium truncate">
                              {char.name}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {char.race} · {char.class} · Lvl {char.level}
                            </div>
                          </div>
                          <div className="text-gray-500 text-xs shrink-0">
                            {char.owner.username}
                          </div>
                        </button>
                      ))}
                      <Link
                        href={`/community?search=${encodeURIComponent(
                          searchQuery
                        )}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="block px-4 py-2.5 text-amber-400 hover:text-amber-300 text-xs text-center border-t border-gray-800 transition-colors"
                      >
                        Zobrazit všechny výsledky →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <NavIcon
              href="/community"
              icon={<Users className="w-5 h-5" />}
              label="Feed"
            />

            {session ? (
              <>
                <NavIcon
                  href="/characters/new"
                  icon={<PlusCircle className="w-5 h-5" />}
                  label="Nová postava"
                />
                <NavIcon
                  href="/dashboard"
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Dashboard"
                />
                {session.user.role === "ADMIN" && (
                  <NavIcon
                    href="/admin"
                    icon={<Shield className="w-5 h-5" />}
                    label="Admin"
                  />
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="relative group flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Odhlásit
                  </span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="ml-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Přihlásit se
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-4 flex flex-col gap-1">
          <MobileLink href="/community" onClick={() => setMenuOpen(false)}>
            Feed
          </MobileLink>
          {session ? (
            <>
              <MobileLink
                href="/characters/new"
                onClick={() => setMenuOpen(false)}
              >
                Nová postava
              </MobileLink>
              <MobileLink href="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </MobileLink>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setMenuOpen(false);
                }}
                className="text-left text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                Odhlásit se
              </button>
            </>
          ) : (
            <MobileLink href="/login" onClick={() => setMenuOpen(false)}>
              Přihlásit se
            </MobileLink>
          )}
        </div>
      )}
    </nav>
  );
}

function NavIcon({
  href,
  onClick,
  icon,
  label,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const className =
    "relative group flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800";
  const content = (
    <>
      {icon}
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href!} className={className}>
      {content}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
    >
      {children}
    </Link>
  );
}
