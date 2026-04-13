"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Sword, Users, Search, LogOut, PlusCircle, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — klik = home */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors">
              <Sword className="w-4 h-4 text-gray-950" />
            </div>
            <span className="font-bold text-white text-lg">CharacterForge</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">

            {/* Feed ikona */}
            <NavIcon href="/community" icon={<Users className="w-5 h-5" />} label="Feed" />

            {/* Search ikona */}
            <NavIcon href="/search" icon={<Search className="w-5 h-5" />} label="Hledat" />

            {session ? (
              <>
                {/* Nová postava */}
                <NavIcon
                  href="/characters/new"
                  icon={<PlusCircle className="w-5 h-5" />}
                  label="Nová postava"
                />

                {/* Dashboard */}
                <NavIcon
                  href="/dashboard"
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Dashboard"
                />

                {/* Odhlásit */}
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
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-current transition-all" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-4 flex flex-col gap-1">
          <MobileLink href="/community" onClick={() => setMenuOpen(false)}>Feed</MobileLink>
          <MobileLink href="/search" onClick={() => setMenuOpen(false)}>Hledat</MobileLink>
          {session ? (
            <>
              <MobileLink href="/characters/new" onClick={() => setMenuOpen(false)}>Nová postava</MobileLink>
              <MobileLink href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                className="text-left text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                Odhlásit se
              </button>
            </>
          ) : (
            <MobileLink href="/login" onClick={() => setMenuOpen(false)}>Přihlásit se</MobileLink>
          )}
        </div>
      )}
    </nav>
  );
}

function NavIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="relative group flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
    >
      {icon}
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
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