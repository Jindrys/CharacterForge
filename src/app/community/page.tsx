import { CommunityFeed } from "@/components/community/CommunityFeed";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Komunita",
  description:
    "Prozkoumej postavy komunity CharacterForge. Najdi inspiraci nebo NPC pro svou kampaň.",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-6">
          <div className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-2">
            Komunita
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            Prozkoumej postavy
          </div>
          <div className="text-gray-400 text-sm">
            Najdi inspiraci nebo NPC pro svou kampaň
          </div>
        </div>

        <CommunityFeed />
      </div>
    </div>
  );
}
