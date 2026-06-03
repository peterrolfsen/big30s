import { AuthProvider } from "@/lib/auth-context";
import AuthGate from "@/components/games/AuthGate";
import GameNav from "@/components/games/GameNav";

export const metadata = {
  title: "Turleker | 30 År i Algarve",
  description: "Bounty Board, Photo Wars og Wheel of Fate",
};

export default function LekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGate>
        <div className="min-h-screen bg-[#0a0a0b]">
          <div className="grain" />
          <GameNav />
          <main className="pt-16 pb-24 md:pb-8">{children}</main>
        </div>
      </AuthGate>
    </AuthProvider>
  );
}
