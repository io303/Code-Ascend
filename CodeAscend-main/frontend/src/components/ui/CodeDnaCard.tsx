import React from "react";
import { Dna, Zap, TrendingUp, Award } from "lucide-react";

export type TopicSkill = {
  topic: string;
  score: number;
  solvedCount: number;
};

export type CodeDnaData = {
  topicSkills: TopicSkill[];
  strongestTopic: string;
  weakestTopic: string;
  overallSkillRating: number;
};

export function CodeDnaCard({ dna }: { dna?: CodeDnaData }) {
  if (!dna || !dna.topicSkills || dna.topicSkills.length === 0) {
    return (
      <div className="rounded-3xl border border-arena-border bg-white p-6 text-center text-xs text-arena-text-secondary space-y-2 shadow-card">
        <Dna className="h-8 w-8 mx-auto text-arena-purple opacity-50" />
        <p>Solve algorithm challenges to analyze your Code DNA profile.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-arena-border bg-white p-6 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-arena-surface-purple border border-arena-purple-light flex items-center justify-center text-arena-purple">
            <Dna className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-arena-text text-base">Code DNA Profile</h3>
            <p className="text-[11px] text-arena-text-secondary">Algorithmic pattern mastery & skill radar</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border border-arena-purple-light bg-arena-surface-purple text-arena-purple">
          Skill Rating: {dna.overallSkillRating}
        </span>
      </div>

      {/* Strongest & Weakest Badges */}
      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50 space-y-1">
          <span className="text-[10px] font-sans font-semibold text-emerald-700 uppercase tracking-wider block">Strongest Topic</span>
          <div className="flex items-center gap-1.5 font-bold text-arena-text">
            <Zap className="h-3.5 w-3.5 text-emerald-600" />
            <span>{dna.strongestTopic}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50 space-y-1">
          <span className="text-[10px] font-sans font-semibold text-amber-700 uppercase tracking-wider block">Target Improvement</span>
          <div className="flex items-center gap-1.5 font-bold text-arena-text">
            <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
            <span>{dna.weakestTopic}</span>
          </div>
        </div>
      </div>

      {/* Skill Bars */}
      <div className="space-y-3 pt-1">
        {dna.topicSkills.slice(0, 6).map((skill) => (
          <div key={skill.topic} className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-arena-text">
              <span className="font-semibold text-arena-text">{skill.topic}</span>
              <span className="font-mono text-arena-text-secondary">
                {skill.solvedCount} solved · <strong className="text-arena-purple">{skill.score}%</strong>
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-arena-surface-subtle overflow-hidden border border-arena-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-arena-purple via-[#9D4EDD] to-[#C084FC] transition-all duration-500 shadow-purple-sm"
                style={{ width: `${Math.max(6, skill.score)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-arena-border text-[11px] font-sans text-arena-text-secondary">
        <span>💡 Code DNA is calculated from the topics and difficulty of problems you successfully solve.</span>
      </div>
    </div>
  );
}
