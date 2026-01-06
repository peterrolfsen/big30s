import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Villa from "@/components/Villa";
import Program from "@/components/Program";
import InteractiveMap from "@/components/InteractiveMap";
import Praktisk from "@/components/Praktisk";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#0a0a0b] min-h-screen">
      {/* Grain overlay */}
      <div className="grain" />

      <Navigation />
      <Hero />
      <Villa />
      <InteractiveMap />
      <Program />
      <Praktisk />
      <Footer />
    </main>
  );
}
