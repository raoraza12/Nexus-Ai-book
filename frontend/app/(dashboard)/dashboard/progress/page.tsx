"use client";

import { BarChart2, TrendingUp, Calendar, Target, Zap, Award, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProgressPage() {
  const weeklyStats = [
    { day: "Mon", val: 40 },
    { day: "Tue", val: 65 },
    { day: "Wed", val: 45 },
    { day: "Thu", val: 90 },
    { day: "Fri", val: 70 },
    { day: "Sat", val: 85 },
    { day: "Sun", val: 55 },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">
            Intelligence Analytics
          </h1>
          <p className="page-subtitle">Real-time tracking of your cognitive evolution.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Stats Card */}
        <div className="lg:col-span-2 space-y-6 sm:gap-8">
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 rounded-3xl shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center shadow-inner">
                    <Target className="text-emerald-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-zinc-900 dark:text-white uppercase italic tracking-tight">Active Mastery</h3>
                    <p className="text-sm font-bold text-zinc-400">Monthly Learning Objective</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-4xl font-black text-emerald-600 italic">75%</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner p-1">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-1000" style={{ width: "75%" }} />
                </div>
                <div className="flex flex-wrap gap-4 justify-between items-center bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-amber-500" />
                    <span className="text-xs font-black uppercase text-zinc-500 tracking-wider">3 of 4 Books Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-indigo-500" />
                    <span className="text-xs font-black uppercase text-zinc-500 tracking-wider">12h Left in Cycle</span>
                  </div>
                </div>
              </div>
           </div>

            {/* Reading Velocity Chart */}
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 rounded-3xl shadow-xl shadow-indigo-500/5">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center shadow-inner">
                    <TrendingUp className="text-indigo-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-zinc-900 dark:text-white uppercase italic tracking-tight">Processing Power</h3>
                    <p className="text-sm font-bold text-zinc-400">Weekly Engagement Depth</p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
                <div className="flex items-end gap-3 min-w-[300px] h-48 sm:h-64 px-2">
                  {weeklyStats.map((stat, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                      <div className="w-full bg-zinc-100 dark:bg-zinc-900/50 rounded-t-xl relative overflow-hidden flex-1 cursor-pointer">
                        <div 
                          style={{ height: `${stat.val}%` }} 
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300 transition-all duration-500 shadow-[0_-5px_15px_rgba(79,70,229,0.2)]" 
                        />
                      </div>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter group-hover:text-indigo-500 transition-colors">
                        {stat.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
              <Zap className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/70 mb-2">Power Level</h4>
                <p className="text-4xl font-black italic mb-6">ELITE</p>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-black uppercase tracking-widest transition-all backdrop-blur-md">
                  Upgrade Tier
                </button>
              </div>
           </div>

           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-zinc-400" size={20} />
                <h4 className="font-black text-sm uppercase tracking-widest text-zinc-400">Milestone Log</h4>
              </div>
              <div className="space-y-6">
                {[
                  { date: "Oct 24", label: "Completed Chapter 3", color: "bg-emerald-500" },
                  { date: "Oct 21", label: "Achieved 7-Day Streak", color: "bg-amber-500" },
                  { date: "Oct 18", label: "Signed up for Nexus AI", color: "bg-indigo-500" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start relative pb-6 border-l-2 border-zinc-100 dark:border-zinc-800 ml-2 pl-6">
                    <div className={cn("absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-zinc-900 shadow-sm", item.color)} />
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{item.date}</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
