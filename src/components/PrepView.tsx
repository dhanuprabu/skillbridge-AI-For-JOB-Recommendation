import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, CheckSquare, Settings } from "lucide-react";
import { InterviewQuestion } from "../types";

interface PrepViewProps {
  questions: InterviewQuestion[];
}

export default function PrepView({ questions }: PrepViewProps) {
  const [openCardIdx, setOpenCardIdx] = useState<number | null>(0);

  const toggleCard = (idx: number) => {
    setOpenCardIdx(openCardIdx === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-medium text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          Interactive Prep Simulation
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Review dynamic interview questions custom-modeled after your technical attributes and expectations.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((item, idx) => {
          const isOpen = openCardIdx === idx;
          return (
            <div 
              key={idx} 
              className={`border rounded-2xl bg-slate-900/30 transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? "border-amber-500/30 shadow-md shadow-amber-500/5 bg-slate-900/50" 
                  : "border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40"
              }`}
            >
              {/* Question Click Header */}
              <button
                onClick={() => toggleCard(idx)}
                className="w-full text-left p-5 flex justify-between items-start gap-4 cursor-pointer"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                    Q
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-white text-sm md:text-base leading-snug">
                      {item.question}
                    </h4>
                    <span className="inline-block mt-2 px-2 py-0.5 roundedbg-slate-950/60 border border-slate-800/60 text-slate-500 text-[10px] font-mono uppercase tracking-wider">
                      Focus: {item.focusArea}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 p-1 bg-slate-950/60 rounded border border-slate-800 text-slate-400">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Collapsible Answer Outline Section */}
              {isOpen && (
                <div className="border-t border-slate-850 bg-slate-950/40 p-5 space-y-4">
                  <div>
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> Ideal Structural Outline Answers
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {item.idealAnswerOutline}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400/80 font-mono bg-amber-500/5 border border-amber-500/10 px-3 py-2 rounded-lg">
                    <span>💡 Tip:</span>
                    <span className="text-slate-400 font-light">Prepare key anecdotes following the STAR technique (Situation, Task, Action, Result) referencing this focus dimension.</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
