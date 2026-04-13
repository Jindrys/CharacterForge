import { HeroSection } from "@/components/landing/HeroSection";
import { ForWhom } from "@/components/landing/ForWhom";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CharacterFeed } from "@/components/landing/CharacterFeed";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <HeroSection />
      <ForWhom />
      <HowItWorks />
      <CharacterFeed />
    </div>
  );
}