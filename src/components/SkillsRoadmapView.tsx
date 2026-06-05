import React from "react";
import { TrendingUp, RefreshCw, Zap, ArrowUpRight } from "lucide-react";
import { SkillAnalysisItem } from "../types";

interface SkillsRoadmapViewProps {
  skills: SkillAnalysisItem[];
}

export default function SkillsRoadmapView({ skills }: SkillsRoadmapViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-display font-medium text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Skills Analysis & Roadmap Benchmarks
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Dynamic benchmark comparison mappings indicating current levels against active industry target vacancies.
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Zap className="w-4 h-4 animate-bounce" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map((item, idx) => {
          let badgeColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
          if (item.currentLevelPercentage >= 80) {
            badgeColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
          } else if (item.currentLevelPercentage >= 65) {
            badgeColor = "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
          }

          return (
            <div 
              key={idx}
              className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all duration-300 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h4 className="font-display font-medium text-white text-sm">
                    {item.skillName}
                  </h4>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono leading-none ${badgeColor}`}>
                    Level: {item.currentLevelPercentage}%
                  </span>
                </div>

                {/* Progress fill */}
                <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden mb-4">
                  <div 
                    className="bg-linear-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${item.currentLevelPercentage}%`, animationDelay: `${idx * 150}ms` }}
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[10px] font-semibold text-slate-500 font-mono uppercase tracking-wider">
                    Targeted Upskilling Plan
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {item.suggestedImprovement}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>SKILL STACK LEVEL</span>
                <span className="flex items-center gap-0.5 text-emerald-400">
                  Ready <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer warning helper */}
      <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-white block">📚 Looking for structured tutorials?</span>
          <span className="text-xs text-slate-400 font-light block mt-0.5">Explore our comprehensive certification programs mapped directly to these dynamic skill pathways.</span>
        </div>
        <button className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold font-mono cursor-pointer self-start sm:self-auto transition-colors flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Synchronize learning stacks
        </button>
      </div>

    </div>
  );
}
