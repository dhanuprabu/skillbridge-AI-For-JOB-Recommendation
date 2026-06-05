import React from "react";
import { Sparkles, Compass } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="relative py-8 px-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl mb-6">
      {/* Decorative background grid effects */}
      <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-indigo-500/10 pointer-events-none" />
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-3 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            SkillBridge AI Strategy
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-2 text-slate-400 text-sm md:text-base max-w-2xl font-light">
            {subtitle}
          </p>
        </div>
        
        <div className="hidden lg:flex items-center gap-3 bg-slate-950/60 border border-slate-800 p-4 rounded-xl backdrop-blur-sm self-start">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-content justify-center text-cyan-400 border border-cyan-500/30">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-mono">INTELLIGENT MATCHING</div>
            <div className="text-xs text-emerald-400 font-mono font-medium">● SYSTEM SYNCS READY</div>
          </div>
        </div>
      </div>
    </header>
  );
}
