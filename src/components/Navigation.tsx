"use client";

import { useState, useEffect } from "react";
import { MapPin, Home, Users, Map, Info, CalendarDays } from "lucide-react";

const navItems = [
  { href: "#villa", label: "Villa", icon: Home },
  { href: "#gjengen", label: "Gjengen", icon: Users },
  { href: "#program", label: "Program", icon: CalendarDays },
  { href: "#kart", label: "Utforsk", icon: Map },
  { href: "#praktisk", label: "Praktisk", icon: Info },
];

export default function Navigation() {
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 hidden md:block ${
          isScrolled ? "glass-strong py-3" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">
                  <span className="gradient-text">ALGARVE</span>
                  <span className="text-zinc-500 font-normal ml-2">2026</span>
                </span>
              </div>
            </a>

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
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile: Minimal top bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:hidden ${
          isScrolled ? "glass-strong py-3" : "py-4"
        }`}
      >
        <div className="px-6">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">
              <span className="gradient-text">ALGARVE</span>
              <span className="text-zinc-500 font-normal ml-1.5 text-sm">2026</span>
            </span>
          </a>
        </div>
      </div>

      {/* Mobile: Bottom navigation bar - alltid synlig */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Gradient fade */}
        <div className="h-6 bg-gradient-to-t from-[#0a0a0b] to-transparent" />

        <div className="bg-[#0a0a0b]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
          <div className="flex justify-around items-center py-2 px-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all"
                >
                  <div className={`p-2.5 rounded-xl transition-all ${
                    isActive ? "bg-orange-500/20" : ""
                  }`}>
                    <item.icon className={`w-5 h-5 transition-all ${
                      isActive ? "text-orange-500" : "text-zinc-500"
                    }`} />
                  </div>
                  <span className={`text-[10px] font-medium transition-colors ${
                    isActive ? "text-orange-500" : "text-zinc-500"
                  }`}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
