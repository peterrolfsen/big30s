"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Medal, Settings2, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { OlEvent } from "@/lib/types";
import TeamLeaderboard from "@/components/olympics/TeamLeaderboard";

export default function OlHubPage() {
  const [nextEvent, setNextEvent] = useState<OlEvent | null>(null);
  const [doneCount, setDoneCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("ol_events")
      .select("*")
      .order("sort_order");
    const events = (data ?? []) as OlEvent[];
    setTotalCount(events.length);
    setDoneCount(events.filter((e) => e.status === "done").length);
    setNextEvent(events.find((e) => e.status !== "done") ?? null);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("ol-hub")
      .on("postgres_changes", { event: "*", schema: "public", table: "ol_events" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6">
      <div className="text-center mb-8 pt-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
          <Medal className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
          OL — <span className="gradient-text">Lekene</span>
        </h1>
        <p className="text-zinc-400 text-sm">
          Lag mot lag. {totalCount > 0 && `${doneCount}/${totalCount} øvelser ferdig.`}
        </p>
      </div>

      {/* Neste øvelse */}
      {nextEvent && (
        <Link
          href="/leker/ol/admin"
          className="block mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] hover:bg-amber-500/[0.1] p-4 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{nextEvent.icon ?? "🏅"}</span>
            <div className="flex-1">
              <p className="text-amber-400/70 text-xs uppercase tracking-wide">
                Neste øvelse
              </p>
              <p className="font-bold text-white">{nextEvent.name}</p>
            </div>
            <span className="text-amber-400 text-sm font-semibold flex items-center gap-1">
              Registrer <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      )}

      {/* Sammenlagt */}
      <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
        Sammenlagt
      </h2>
      <TeamLeaderboard variant="full" editable />

      {/* Admin-lenke */}
      <Link
        href="/leker/ol/admin"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] py-3 text-zinc-300 text-sm transition-colors"
      >
        <Settings2 className="w-4 h-4" /> Administrer lag og øvelser
      </Link>
    </div>
  );
}
