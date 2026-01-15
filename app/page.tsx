"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { ArchitectureSection } from "@/components/website-components/architecture-section";
import { FeatureSection } from "@/components/website-components/feature-section";
import { Footer } from "@/components/website-components/footer";
import { HeroSection } from "@/components/website-components/hero-section";
import { Navbar } from "@/components/website-components/navbar";

export default function HomePage() {
  return (
    <div
      className="
        relative overflow-hidden
        bg-white text-slate-900
        dark:bg-black dark:text-white
      "
    >
      {/* Background effect (dark only recommended) */}
      <div className="hidden dark:block">
        <BackgroundBeams />
      </div>

      <Navbar />
      <HeroSection />
      <FeatureSection />
      <ArchitectureSection />
      <Footer />
    </div>
  );
}
