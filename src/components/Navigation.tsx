"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Map,
  Info,
  CalendarDays,
  ExternalLink,
  Gamepad2,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { logout } from "@/lib/auth/actions";

const navItems = [
  { href: "#villa", label: "Villa", icon: Home },
  { href: "#kart", label: "Kart", icon: Map },
  { href: "#program", label: "Program", icon: CalendarDays },
  { href: "#praktisk", label: "Praktisk", icon: Info },
];

export default function Navigation() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);

      // Finn aktiv seksjon
      const sections = navItems.map((item) => item.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop: Top navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 hidden md:block bg-[#0a0a0b] ${
          isScrolled ? "py-3 border-b border-white/5" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                  <span className="text-white font-black text-lg">30</span>
                </div>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Big Thirties
                </span>
              </a>
              <a
                href="https://www.springvillas.net/VillaPeninaMajestic/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                Se villaen
              </a>
            </div>

            {/* Desktop menu */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl transition-all ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </a>
                );
              })}
              <div className="w-px h-5 bg-white/10 mx-2" />
              <a
                href="/leker"
                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl transition-all text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40"
              >
                <Gamepad2 className="w-4 h-4" />
                Leker
              </a>
              {user && (
                <>
                  <div className="w-px h-5 bg-white/10 mx-2" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-400">
                      Hei,{" "}
                      <span className="text-white font-medium">
                        {user.name.split(" ")[0]}
                      </span>
                    </span>
                    <form action={logout}>
                      <button
                        type="submit"
                        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        title="Logg ut"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile: Bottom navigation bar - alltid synlig */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Gradient fade */}
        <div className="h-6 bg-gradient-to-t from-[#0a0a0b] to-transparent" />

        <div className="bg-[#0a0a0b]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
          {/* Brukerindikator på mobil */}
          {user && (
            <div className="flex items-center justify-between px-4 pt-2 pb-1">
              <span className="text-xs text-zinc-500">
                Logget inn som{" "}
                <span className="text-zinc-300 font-medium">
                  {user.name.split(" ")[0]}
                </span>
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Logg ut
                </button>
              </form>
            </div>
          )}
          <div className="flex justify-around items-center py-2 px-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all"
                >
                  <div
                    className={`p-2.5 rounded-xl transition-all ${
                      isActive ? "bg-orange-500/20" : ""
                    }`}
                  >
                    <item.icon
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
                    {item.label}
                  </span>
                </a>
              );
            })}
            <a
              href="/leker"
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <Gamepad2 className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] font-medium text-amber-400">
                Leker
              </span>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
