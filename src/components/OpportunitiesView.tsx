import React from "react";
import { Briefcase, Building, DollarSign, Sparkles, CheckCircle2 } from "lucide-react";
import { InternshipOpportunity } from "../types";

interface OpportunitiesViewProps {
  internships: InternshipOpportunity[];
}

export default function OpportunitiesView({ internships }: OpportunitiesViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-display font-medium text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Smart Internship Matching
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-light">
            AI matched listings and skill bridges curated according to your technical competencies.
          </p>
        </div>
        
        <div className="text-xs text-indigo-400 font-mono bg-indigo-505/10 border border-indigo-500/20 px-3 py-1 rounded-md self-start">
          💡 REAL-TIME FIT SCORING ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {internships.map((opp, idx) => (
          <div 
            key={idx}
            className="group relative bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 rounded-2xl p-5 hover:shadow-lg hover:shadow-indigo-500/5 backdrop-blur-md flex flex-col justify-between"
          >
            {/* Visual gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-850">
                <div className="flex gap-3">
                  <div className="w-11 h-11 bg-indigo-500/15 border border-indigo-500/30 rounded-lg flex items-center justify-center text-indigo-400 font-display font-semibold shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-white text-base">
                      {opp.role}
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {opp.company}
                    </span>
                  </div>
                </div>

                <div className="bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded-md text-center font-mono shrink-0">
                  <span className="block text-[10px] uppercase text-slate-500">Fit Rate</span>
                  <span className="text-xs font-bold">{opp.matchPercentage}%</span>
                </div>
              </div>

              {/* Role Details */}
              <p className="text-xs text-slate-300 mt-4 leading-relaxed font-light">
                {opp.description}
              </p>

              {/* Cover dynamic target advice card */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl mt-4">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 font-mono uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Resume Alignment Tip
                </div>
                <p className="text-[11px] text-slate-400 leading-normal font-light">
                  {opp.applyTips}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-850">
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-medium">
                <DollarSign className="w-4 h-4 shrink-0" />
                <span>Estimate: {opp.salary}</span>
              </div>

              <button className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 transition-colors cursor-pointer text-white text-xs font-medium rounded-lg font-mono flex items-center gap-1">
                <span>Lock Application Tips</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
