"use client";

import { useState } from "react";
import {
  ChevronDown,
  Plane,
  Calendar,
  CreditCard,
  Backpack,
  MapPin,
  Car,
  Clock,
  Check
} from "lucide-react";
import { tripConfig, transportConfig } from "@/config/trip";

interface AccordionItem {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  content: React.ReactNode;
}

function Accordion({ item, isOpen, onToggle }: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="glass rounded-xl md:rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`w-10 h-10 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
            <item.icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-base md:text-lg font-semibold text-white">{item.title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-zinc-400 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${
        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="px-4 md:px-5 pb-4 md:pb-5 pt-1">
          {item.content}
        </div>
      </div>
    </div>
  );
}

function ReiseContent() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
          <Plane className="w-4 h-4 text-cyan-500" />
          Fly til Faro
        </h4>
        <div className="space-y-2">
          {transportConfig.flights.map((flight) => (
            <div key={flight.city} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium">{flight.city}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-zinc-400 text-sm">{flight.destinationAirport}</span>
              </div>
              <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">
                {flight.airport}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-green-500" />
          <span className="text-zinc-300 text-sm">{transportConfig.fromAirport}</span>
        </div>
      </div>
    </div>
  );
}

function ProgramContent() {
  const days = ["Sø 7", "Ma 8", "Ti 9", "On 10", "To 11", "Fr 12", "Lø 13"];
  return (
    <div className="space-y-3">
      <div className="bg-white/5 rounded-lg p-4 text-center">
        <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
        <p className="text-zinc-400 text-sm">Program kommer snart</p>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((dag, i) => (
          <div
            key={dag}
            className={`text-center py-2 rounded-lg ${
              i === 0 ? "bg-green-500/20 text-green-400" :
              i === 6 ? "bg-red-500/20 text-red-400" :
              "bg-white/5 text-zinc-400"
            }`}
          >
            <span className="text-[10px] md:text-xs font-medium">{dag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriserContent() {
  const { prices, payment, included } = tripConfig;

  return (
    <div className="space-y-4">
      {/* Per person price - highlighted */}
      <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-xl p-4">
        <p className="text-orange-300/70 text-xs mb-1">Pris per person</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold text-orange-400">
            ~{prices.perPersonNOK.toLocaleString()} kr
          </span>
          <span className="text-zinc-500 text-sm">
            (€{prices.perPerson})
          </span>
        </div>
        <p className="text-zinc-500 text-xs mt-1">+ kommuneavgift €{prices.municipalityFeeTotal}/person</p>
      </div>

      {/* Total price */}
      <div className="bg-white/5 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 text-sm">Total villa ({tripConfig.totalParticipants} pers.)</span>
          <span className="text-white font-semibold">€{prices.villaTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment schedule */}
      <div className="bg-white/5 rounded-lg p-3 space-y-2">
        <p className="text-zinc-300 text-sm font-medium mb-2">Betalingsplan</p>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Ved booking</span>
          <span className="text-zinc-300">{payment.schedule.atBooking}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">90 dager før</span>
          <span className="text-zinc-300">{payment.schedule.ninetyDaysBefore}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">1 uke før</span>
          <span className="text-zinc-300">{payment.schedule.oneWeekBefore}</span>
        </div>
        <div className="border-t border-white/10 pt-2 mt-2">
          <p className="text-zinc-500 text-xs">
            Betaling via {payment.methods.join(", ")}
          </p>
        </div>
      </div>

      {/* Included */}
      <div>
        <p className="text-zinc-300 text-sm font-medium mb-2">Inkludert i prisen</p>
        <div className="flex flex-wrap gap-1.5">
          {included.slice(0, 6).map((item) => (
            <span key={item} className="inline-flex items-center gap-1 text-zinc-400 text-xs bg-white/5 px-2 py-1 rounded">
              <Check className="w-3 h-3 text-green-500" />
              {item}
            </span>
          ))}
          {included.length > 6 && (
            <span className="text-zinc-600 text-xs px-2 py-1">
              +{included.length - 6} mer
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PakkelisteContent() {
  const items = [
    "Badetøy", "Solkrem", "Solbriller", "Shorts", "T-skjorter",
    "Pass/ID", "Førerkort", "Bankkort", "Reiseadapter", "Finantrekk"
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="bg-white/5 text-zinc-400 text-xs px-2.5 py-1.5 rounded-lg"
        >
          {item}
        </span>
      ))}
      <span className="text-zinc-600 text-xs px-2.5 py-1.5">+ mer...</span>
    </div>
  );
}

export default function Praktisk() {
  const [openItems, setOpenItems] = useState<string[]>(["priser"]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const items: AccordionItem[] = [
    {
      id: "reise",
      title: "Reise & Transport",
      icon: Plane,
      color: "from-cyan-500 to-blue-500",
      content: <ReiseContent />
    },
    {
      id: "program",
      title: "Program",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      content: <ProgramContent />
    },
    {
      id: "priser",
      title: "Priser & Betaling",
      icon: CreditCard,
      color: "from-green-500 to-emerald-500",
      content: <PriserContent />
    },
    {
      id: "pakkeliste",
      title: "Pakkeliste",
      icon: Backpack,
      color: "from-orange-500 to-amber-500",
      content: <PakkelisteContent />
    },
  ];

  return (
    <section id="praktisk" className="py-12 md:py-24 relative">
      <div className="max-w-2xl mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-green-500 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">
            Alt du trenger
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Praktisk info
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {items.map((item) => (
            <Accordion
              key={item.id}
              item={item}
              isOpen={openItems.includes(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
