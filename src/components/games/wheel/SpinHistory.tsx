"use client";

import { useState, useEffect } from "react";
import { Clock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SpinRecord {
  id: string;
  result: string;
  mode: string;
  created_at: string;
  participants?: { display_name: string };
}

export default function SpinHistory() {
  const [spins, setSpins] = useState<SpinRecord[]>([]);

  useEffect(() => {
    loadHistory();

    const channel = supabase
      .channel("wheel-history")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wheel_spins" },
        () => loadHistory()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadHistory() {
    const { data } = await supabase
      .from("wheel_spins")
      .select("id, result, mode, created_at, participants(display_name)")
      .order("created_at", { ascending: false })
      .limit(15);

    if (data) setSpins(data as unknown as SpinRecord[]);
  }

  const modeLabels: Record<string, string> = {
    names: "Hvem tar?",
    dare: "Dare",
    custom: "Custom",
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (spins.length === 0) {
    return (
      <div className="glass rounded-xl p-4 text-center">
        <Clock className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
        <p className="text-zinc-500 text-xs">Ingen spinn ennå</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Siste spinn
        </h3>
      </div>
      <div className="divide-y divide-white/5 max-h-80 overflow-y-auto custom-scrollbar">
        {spins.map((spin) => (
          <div key={spin.id} className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {spin.result}
              </p>
              <p className="text-zinc-500 text-xs flex items-center gap-1">
                <User className="w-3 h-3" />
                {spin.participants?.display_name || "Ukjent"} ·{" "}
                {modeLabels[spin.mode] || spin.mode}
              </p>
            </div>
            <span className="text-zinc-600 text-xs shrink-0">
              {formatTime(spin.created_at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
