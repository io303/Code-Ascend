import React from "react";
import { Trophy, TrendingUp, ArrowUpRight } from "lucide-react";

interface RoadToNextTierProps {
  currentRating: number;
  tier?: string;
  recentDelta?: number;
}

const TIER_THRESHOLDS = [
  { name: "Newcomer", min: 0, max: 1199 },
  { name: "Pupil", min: 1200, max: 1399 },
  { name: "Specialist", min: 1400, max: 1599 },
  { name: "Candidate Master", min: 1600, max: 1899 },
  { name: "Master", min: 1900, max: 2199 },
  { name: "Grandmaster", min: 2200, max: 9999 },
];

export function RoadToNextTier({ currentRating, tier = "Pupil", recentDelta }: RoadToNextTierProps) {
  // Find current and next tier
  const currentTierIndex = TIER_THRESHOLDS.findIndex(
    (t) => currentRating >= t.min && currentRating <= t.max
  );
  
  const currentTierObj = TIER_THRESHOLDS[currentTierIndex >= 0 ? currentTierIndex : 1];
  const nextTierObj = TIER_THRESHOLDS[Math.min(TIER_THRESHOLDS.length - 1, (currentTierIndex >= 0 ? currentTierIndex : 1) + 1)];

  const isMaxTier = currentTierObj.name === "Grandmaster";
  const pointsNeeded = isMaxTier ? 0 : Math.max(0, nextTierObj.min - currentRating);
  
  const rangeTotal = isMaxTier ? 1 : nextTierObj.min - currentTierObj.min;
  const rangeCurrent = isMaxTier ? 1 : currentRating - currentTierObj.min;
  const progressPercent = isMaxTier ? 100 : Math.min(100, Math.max(0, Math.round((rangeCurrent / rangeTotal) * 100)));

  return (
    <div className="p-6 rounded-3xl border border-arena-border bg-white shadow-card space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-arena-text text-base font-sans">
              {isMaxTier ? "Grandmaster Ascension Peak" : `Ascend to ${nextTierObj.name}`}
            </h3>
            <p className="text-[11px] text-arena-text-secondary font-sans">Competitive rating progression and threshold target</p>
          </div>
        </div>

        {recentDelta != null && recentDelta > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+{recentDelta} Elo Gain</span>
          </span>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-arena-surface-purple border border-arena-purple-light space-y-3">
        <div className="flex items-center justify-between text-arena-text font-bold">
          <div className="space-y-0.5">
            <span className="text-[10px] text-arena-text-secondary uppercase block font-sans">Current Tier</span>
            <span className="text-sm text-arena-purple">{currentTierObj.name} ({currentRating} Elo)</span>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-[10px] text-arena-text-secondary uppercase block font-sans">Ascension Goal</span>
            <span className="text-sm text-amber-700">
              {isMaxTier ? "Grandmaster Peak" : `${nextTierObj.name} (${nextTierObj.min} Elo)`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="h-2.5 w-full rounded-full bg-white overflow-hidden border border-arena-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-arena-purple via-[#9D4EDD] to-amber-500 transition-all duration-500 shadow-purple-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-arena-text-secondary pt-0.5">
            <span>{progressPercent}% Complete</span>
            <span>
              {isMaxTier ? (
                "Maximum Tier Reached"
              ) : (
                <>
                  <strong className="text-arena-text">{pointsNeeded} Elo</strong> needed for {nextTierObj.name}
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
