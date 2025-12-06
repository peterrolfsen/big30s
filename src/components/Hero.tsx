"use client";

import { useState, useEffect } from "react";
import { ArrowDown, MapPin, ExternalLink } from "lucide-react";
import { tripConfig, villaConfig } from "@/config/trip";

// Bakgrunnsbilder som roterer
const heroImages = [
  "/30year/Springvilla.jpg",
  "/30year/springvilla2.jpg",
  "/30year/algarve.avif",
  "/30year/algarve2.webp",
];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Roter bakgrunnsbilde hvert 6. sekund
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(imageInterval);
  }, []);

  useEffect(() => {
    const targetDate = new Date(tripConfig.startDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background images with crossfade and subtle zoom */}
      {heroImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
            index === currentImageIndex ? "scale-105" : "scale-100"
          }`}
          style={{
            backgroundImage: `url('${image}')`,
            opacity: index === currentImageIndex ? 1 : 0,
            transitionProperty: "opacity, transform",
            transitionDuration: index === currentImageIndex ? "1000ms, 6000ms" : "1000ms, 0ms",
          }}
        />
      ))}
      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/60 via-amber-900/50 to-[#0a0a0b]" />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Floating orbs - mindre på mobil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-orange-500/20 rounded-full blur-[100px] md:blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/20 rounded-full blur-[100px] md:blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto pt-16 md:pt-0">
        {/* Date badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-6 md:mb-8 border border-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs md:text-sm text-zinc-200">7. - 14. juni 2026</span>
        </div>

        {/* Main title */}
        <h1 className="text-[7vw] sm:text-4xl md:text-7xl lg:text-8xl font-black tracking-tight mb-3 md:mb-5 drop-shadow-lg whitespace-nowrap">
          <span className="gradient-text" style={{ textShadow: '0 2px 20px rgba(251,146,60,0.4)' }}>Den store 30 års turen</span>
        </h1>
        <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
          <MapPin className="w-4 h-4 md:w-5 md:h-5 text-zinc-400" />
          <p className="text-xl md:text-2xl lg:text-3xl font-medium text-zinc-300 drop-shadow-md">
            Algarve, Portugal
          </p>
        </div>

        {/* Villa link */}
        <a
          href={villaConfig.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm md:text-base hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 mb-8 md:mb-12"
        >
          <span>Se villaen</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Countdown - kompakt på mobil */}
        <div className="flex justify-center gap-2 md:gap-4 mb-12 md:mb-20">
          {[
            { value: timeLeft.days, label: "Dager" },
            { value: timeLeft.hours, label: "Timer" },
            { value: timeLeft.minutes, label: "Min" },
            { value: timeLeft.seconds, label: "Sek" },
          ].map((item, i) => (
            <div key={item.label} className="relative">
              <div className="glass rounded-xl md:rounded-2xl p-3 md:p-5 min-w-[60px] md:min-w-[90px] border border-white/10 backdrop-blur-md">
                <div className="text-2xl md:text-4xl font-mono font-bold text-white drop-shadow-md">
                  {item.value.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] md:text-xs text-zinc-300 uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
              {i < 3 && (
                <span className="absolute -right-1.5 md:-right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg md:text-2xl">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <a
          href="#villa"
          className="inline-flex flex-col items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <span className="text-[10px] md:text-xs uppercase tracking-widest">Utforsk</span>
          <ArrowDown className="w-4 h-4 md:w-5 md:h-5 animate-bounce" />
        </a>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-28 md:bottom-36 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? "bg-white w-6"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Vis bilde ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-[#0a0a0b] to-transparent" />
    </section>
  );
}
