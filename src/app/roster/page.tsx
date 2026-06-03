import type { Metadata } from "next";
import DraftScreen from "@/components/roster/DraftScreen";

export const metadata: Metadata = {
  title: "Lagtrekning | 30 År i Algarve",
  description: "Select your squad — fighting-game lagtrekning for turen.",
};

export default function RosterPage() {
  return <DraftScreen />;
}
