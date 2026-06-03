import type { Metadata } from "next";
import TeamsView from "@/components/roster/TeamsView";

export const metadata: Metadata = {
  title: "Lagene | 30 År i Algarve",
  description: "De ferdige lagene fra lagtrekningen.",
};

export default function TeamsPage() {
  return <TeamsView />;
}
