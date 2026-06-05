import React from "react";
import { Award, CheckCircle, Lightbulb, AlertTriangle, ChevronRight } from "lucide-react";
import { ResumeScore } from "../types";

interface ResumeScoreCardProps {
  score: ResumeScore;
}

export default function ResumeScoreCard({ score }: ResumeScoreCardProps) {
  // Determine overall status colors and title
  const getScoreRating = (val: number) => {
    if (val >= 90) return { title: "Outstanding Alignment", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" };
    if (val >= 75) return { title: "Strong Alignment", color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" };
    return { title: "Evolving Alignment", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" };
  };

  const rating = getScoreRating(score.overall);

  // Compute conic gradient score angle
  const fillPercentage = score.overall;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
      
      {/* Circle Meter section */}
      <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-6 lg:pb-0 lg:pr-6">
        <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-6 font-mono text-center">
          Overview Index
        </h3>
        
        <div className="relative w-44 h-44 flex items-center justify-center rounded-full bg-slate-950/40 border border-slate-800/80 shadow-inner">
          {/* Circular SVG Progress */}
          <svg className="absolute w-44 h-44 -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="76"
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r="76"
              className="stroke-cyan-500 transition-all duration-1000 ease-out"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={477}
              strokeDashoffset={477 - (477 * fillPercentage) / 100}
              strokeLinecap="round"
            />
          </svg>
          
          <div className="text-center z-10">
            <span className="block text-5xl font-display font-bold text-white tracking-tight">
              {score.overall}
            </span>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Resume Score
            </span>
          </div>
        </div>

        <div className={`mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${rating.bg} ${rating.border} ${rating.color} text-xs font-semibold font-mono`}>
          <Award className="w-3.5 h-3.5" />
          {rating.title}
        </div>
      </div>

      {/* Numerical breakdown bars */}
      <div className="lg:col-span-8 flex flex-col gap-6 lg:pl-6">
        <div>
          <h3 className="text-lg font-display font-medium text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            Core Dimension Analytics
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-light">
            AI evaluated matrix across professional parameters relative to your target role interest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Technical Competence", val: score.technicalSkills },
            { label: "Role Suitability", val: score.experienceLevel },
            { label: "Project Portfolio Weight", val: score.projectPortfolio },
            { label: "Communication Estimation", val: score.communicationSkills }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/40">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400 font-medium">{item.label}</span>
                <span className="text-cyan-400 font-semibold font-mono">{item.val}%</span>
              </div>
              <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-linear-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Strengths and Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Found Strengths
            </h4>
            <ul className="space-y-1.5">
              {score.reasons.map((item, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-1">
                  <ChevronRight className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-cyan-500/5 border border-cyan-500/10 p-4 rounded-xl">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> Actionable suggestions
            </h4>
            <ul className="space-y-1.5">
              {score.suggestions.map((item, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-1">
                  <ChevronRight className="w-3 h-3 text-cyan-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
