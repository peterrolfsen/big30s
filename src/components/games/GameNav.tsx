"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gamepad2,
  Target,
  Camera,
  CircleDot,
  Trophy,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const gameLinks = [
  { href: "/leker", label: "Leker", icon: Gamepad2, mobileOnly: false },
  { href: "/leker/wheel", label: "Hjulet", icon: CircleDot, mobileOnly: false },
  { href: "/leker/bounty", label: "Bounty", icon: Target, mobileOnly: false },
  { href: "/leker/foto", label: "Foto", icon: Camera, mobileOnly: false },
  { href: "/leker/poeng", label: "Poeng", icon: Trophy, mobileOnly: false },
];

export default function GameNav() {
  const pathname = usePathname();
  const { session, logout } = useAuth();

  return (
    <>
      {/* Desktop: Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block bg-[#0a0a0b] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Tilbake
              </Link>
              <div className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-1">
                {gameLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/leker" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
                        isActive
                          ? "text-white bg-white/10"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400">
                {session?.displayName}
              </span>
              <button
                onClick={logout}
                className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                title="Logg ut"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile: Bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="h-6 bg-gradient-to-t from-[#0a0a0b] to-transparent" />
        <div className="bg-[#0a0a0b]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
          <div className="flex justify-around items-center py-2 px-2">
            {gameLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/leker" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all"
                >
                  <div
                    className={`p-2 rounded-xl transition-all ${
                      isActive ? "bg-orange-500/20" : ""
                    }`}
                  >
                    <link.icon
                      className={`w-5 h-5 transition-all ${
                        isActive ? "text-orange-500" : "text-zinc-500"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      isActive ? "text-orange-500" : "text-zinc-500"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
