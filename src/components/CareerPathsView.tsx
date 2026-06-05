import React, { useState } from "react";
import { Compass, Sparkles, Code2, ArrowRight, PlayCircle } from "lucide-react";
import { CareerPath } from "../types";

interface CareerPathsViewProps {
  careers: CareerPath[];
}

export default function CareerPathsView({ careers }: CareerPathsViewProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const activeCareer = careers[selectedIdx] || careers[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left List of Career Recommendations */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <div className="mb-2">
          <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase font-mono">
            Generated Paths
          </h3>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Select a pathway to see action steps and curriculum.
          </p>
        </div>

        {careers.map((career, idx) => {
          const isActive = selectedIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                isActive
                  ? "bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/5 translate-x-1"
                  : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0 p-1 bg-slate-950/60 rounded-lg border border-slate-800">
                  {career.icon || "💻"}
                </span>
                <div className="min-w-0">
                  <h4 className="font-display font-medium text-sm text-white truncate">
                    {career.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-light">
                    {career.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-xs font-semibold font-mono text-cyan-400">
                  {career.matchPercentage}%
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Match
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Detail Pane */}
      {activeCareer && (
        <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  {activeCareer.icon || "🚀"}
                </span>
                <div>
                  <h3 className="text-lg font-display font-medium text-white">
                    {activeCareer.title}
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3 animate-pulse" /> Best Fit Matching Pathway
                  </p>
                </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg text-center">
                <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Match Index</div>
                <div className="text-sm font-bold font-mono text-cyan-400">{activeCareer.matchPercentage}%</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 mt-4 leading-relaxed font-light">
              {activeCareer.description}
            </p>

            {/* In-demand Technologies */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Key Technologies Required
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeCareer.keySkillsNeeded.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Study Guidelines / Learning Steps */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-3">
                Actionable Bridge Pathway Steps
              </h4>
              <div className="space-y-3">
                {activeCareer.learningPathSteps.map((step, i) => (
                  <div key={i} className="flex gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/40">
                    <div className="w-6 h-6 rounded-md bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold border border-cyan-500/20 shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">INTELLIGENCE SUITE V1.0</span>
            <div className="flex items-center gap-1 text-cyan-400">
              <span>View full curriculum roadmap</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
