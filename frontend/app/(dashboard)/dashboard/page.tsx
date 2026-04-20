"use client";

import { BookOpen, BookMarked, TrendingUp, Clock, Star, ArrowRight, Zap, Target } from "lucide-react";
import { MASTER_BOOK_ID, MASTER_BOOK_SLUG } from "@/lib/constants";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STAT_CARDS = [
  { label: "Books Reading",   value: "3",    icon: BookOpen,    color: "text-blue-500", bg: "bg-blue-500/10"   },
  { label: "Chapters Done",   value: "24",   icon: BookMarked,  color: "text-violet-500", bg: "bg-violet-500/10" },
  { label: "Reading Streak",  value: "7d",   icon: TrendingUp,  color: "text-emerald-500", bg: "bg-emerald-500/10"},
  { label: "Hours This Week", value: "12h",  icon: Clock,       color: "text-amber-500", bg: "bg-amber-500/10"  },
];

const RECENT_BOOKS = [
  { title: "Deep Learning",          author: "Goodfellow et al.",  progress: 68, genre: "ML" },
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas",     progress: 42, genre: "Dev" },
  { title: "Atomic Habits",           author: "James Clear",        progress: 91, genre: "Self" },
];

export default function DashboardPage() {
  const [firstName, setFirstName] = useState("Reader");
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (profile?.full_name) setFirstName(profile.full_name.split(" ")[0]);
      }
    }
    getUser();
  }, [supabase]);

  return (
    <div className="flex flex-col gap-6 sm:gap-10 p-4 sm:p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto w-full overflow-hidden">
      {/* ── Welcome Header ────────────────────────────────────────── */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-tight uppercase italic">
            Welcome, {firstName}
          </h1>
          <p className="text-xs sm:text-base text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">Your intelligence evolution is 12% complete.</p>
        </div>
        <Link 
          href={`/reader/${MASTER_BOOK_SLUG}/1`} 
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all group shrink-0 uppercase tracking-widest w-full lg:w-auto"
        >
          <BookMarked size={18} className="group-hover:rotate-12 transition-transform" />
          Continue Journey
        </Link>
      </header>

      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative min-w-0">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-inner shrink-0", bg, color)}>
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 leading-none truncate">{value}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1.5 truncate">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Roadmap Highlight ────────────────────────────────── */}
      <section className="relative bg-zinc-900 dark:bg-zinc-900/40 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-16 border border-zinc-800 overflow-hidden shadow-2xl group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none group-hover:bg-indigo-600/30 transition-colors" />
        
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
          <div className="text-center xl:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-8 border border-indigo-500/20">
              CURRENT FOCUS
            </div>
            <h2 className="text-2xl sm:text-5xl font-black text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight italic uppercase">Mastering <br className="hidden sm:block" /> Agentic AI</h2>
            <p className="text-zinc-400 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed max-w-md mx-auto xl:mx-0 font-medium">
              You're currently deep in the <span className="text-white font-bold italic underline decoration-indigo-500 underline-offset-4">Intermediate Phase</span>. 2 chapters remaining to reach Senior status.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start">
              <Link 
                href={`/reader/${MASTER_BOOK_SLUG}/4`} 
                className="px-8 py-4 bg-white text-zinc-900 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 shadow-xl transition-all text-center"
              >
                Resume Chapter 4
              </Link>
              <button className="px-8 py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-black text-lg border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-all">
                Full Curriculum
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-md">
               <div className="flex items-center justify-between mb-10">
                  <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Neural Proficiency</span>
                  <Zap size={18} className="text-indigo-400" />
               </div>
               <div className="space-y-8">
                  {[
                    { label: "Generative AI Foundations", val: 95 },
                    { label: "Orchestration Layers", val: 65 },
                    { label: "Autonomous Reasoning", val: 40 },
                  ].map(skill => (
                    <div key={skill.label} className="space-y-3">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-zinc-400">
                          <span>{skill.label}</span>
                          <span className="text-indigo-400">{skill.val}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-zinc-700/50 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${skill.val}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Library Grid ────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl sm:text-3xl font-[1000] tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase italic">Your Library</h2>
          <Link href="/dashboard/books" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-widest">Explore All ↗</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {RECENT_BOOKS.map((book) => (
            <div key={book.title} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 group relative flex flex-col min-w-0">
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 px-3 py-1 rounded-lg uppercase border border-indigo-200 dark:border-indigo-500/20">{book.genre}</span>
                <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors mb-2 leading-tight uppercase tracking-tight truncate w-full">{book.title}</h3>
              <p className="text-sm font-bold text-zinc-400 mb-8 truncate w-full">{book.author}</p>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <span>Reading Progress</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-black">{book.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-indigo-500 transition-all duration-700 shadow-sm" style={{ width: `${book.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
