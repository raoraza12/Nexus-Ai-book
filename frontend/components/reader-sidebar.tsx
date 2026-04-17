"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, Lock, Zap, Target, Star, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ELITE_BOOK_CONTENT } from "@/lib/book-content";
import { getChapterTopics, Topic } from "@/lib/content-utils";

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  section: "Junior" | "Intermediate" | "Senior";
}

interface ReaderSidebarProps {
  chapters: Chapter[];
  bookId: string;
}

export function ReaderSidebar({ chapters, bookId }: ReaderSidebarProps) {
  const pathname = usePathname();
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);

  // Auto-expand the active chapter on mount or prefix change
  useEffect(() => {
    const chapterMatch = pathname.match(/\/reader\/[^/]+\/(\d+)/);
    if (chapterMatch) {
      const activeNum = parseInt(chapterMatch[1]);
      setExpandedChapters((prev) => Array.from(new Set([...prev, activeNum])));
    }
  }, [pathname]);

  const toggleChapter = (num: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedChapters((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const grouped = {
    Junior: chapters.filter((c) => c.section === "Junior"),
    Intermediate: chapters.filter((c) => c.section === "Intermediate"),
    Senior: chapters.filter((c) => c.section === "Senior"),
  };

  const levelConfig = {
    Junior: {
      color: "from-emerald-500/20 to-emerald-500/5",
      text: "text-emerald-500",
      border: "border-emerald-500/20",
      icon: <Zap size={10} />,
      label: "Junior Pilot"
    },
    Intermediate: {
      color: "from-blue-500/20 to-blue-500/5",
      text: "text-blue-500",
      border: "border-blue-500/20",
      icon: <Target size={10} />,
      label: "Systems Architect"
    },
    Senior: {
      color: "from-purple-500/20 to-purple-500/5",
      text: "text-purple-500",
      border: "border-purple-500/20",
      icon: <Star size={10} />,
      label: "Lead Engineer"
    },
  };

  // Mock progress
  const completedChapters = [1];

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* Progress Header */}
      <div className="px-8 py-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-[10px] tracking-[0.25em] text-zinc-400 dark:text-zinc-500 uppercase">Mission Progress</h2>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">12%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden shadow-inner flex items-center px-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "12%" }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 space-y-12 custom-scrollbar pb-20">
        {(["Junior", "Intermediate", "Senior"] as const).map((level) => {
          if (grouped[level].length === 0) return null;
          const config = levelConfig[level];
          
          return (
            <div key={level} className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                  config.color, config.text, config.border
                )}>
                  {config.icon}
                  {config.label}
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-zinc-200 dark:from-zinc-800 to-transparent" />
              </div>
              
              <ul className="space-y-1">
                {grouped[level].map((chapter) => {
                  const href = `/reader/${bookId}/${chapter.chapter_number}`;
                  const isActive = pathname === href;
                  const isCompleted = completedChapters.includes(chapter.chapter_number);
                  const isLocked = chapter.chapter_number > 3 && !isCompleted && !isActive; // Example lock logic
                  
                  return (
                    <li key={chapter.id} className="space-y-1">
                      <div className="flex items-center gap-1 group/item">
                        <Link
                          href={isLocked ? "#" : href}
                          className={cn(
                            "flex-1 relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300",
                            isActive 
                              ? "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5 dark:shadow-black/20" 
                              : "hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 border border-transparent",
                            isLocked && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="activeIndicator"
                              className="absolute inset-y-3 left-0 w-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                            />
                          )}
                          
                          <div className="flex-shrink-0 relative z-10">
                            {isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                 <CheckCircle2 size={12} className="text-emerald-500" />
                              </div>
                            ) : isLocked ? (
                              <Lock size={12} className="text-zinc-400" />
                            ) : (
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                isActive 
                                  ? "border-indigo-500 bg-indigo-500/10" 
                                  : "border-zinc-200 dark:border-zinc-800 group-hover:border-zinc-300 dark:group-hover:border-zinc-700"
                              )}>
                                <span className={cn(
                                  "text-[10px] font-black",
                                  isActive ? "text-indigo-500" : "text-zinc-400"
                                )}>
                                  {chapter.chapter_number}
                                </span>
                              </div>
                            )}
                          </div>
                          
                        <span className={cn(
                          "flex-1 text-sm tracking-tight transition-colors truncate relative z-10",
                          isActive 
                            ? "font-black text-zinc-900 dark:text-zinc-100" 
                            : "font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                        )}>
                          {chapter.title}
                        </span>
                      </Link>

                      {/* Expansion Arrow */}
                      <button
                        onClick={(e) => toggleChapter(chapter.chapter_number, e)}
                        className={cn(
                          "p-2 rounded-xl transition-all duration-300",
                          expandedChapters.includes(chapter.chapter_number) 
                            ? "bg-indigo-500/10 text-indigo-500 rotate-90" 
                            : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                        )}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Nested Topics */}
                    <AnimatePresence initial={false}>
                      {expandedChapters.includes(chapter.chapter_number) && (
                        <motion.ul 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden ml-9 border-l-2 border-zinc-100 dark:border-zinc-800/50 pl-5 space-y-3 mt-2 mb-6"
                        >
                          {getChapterTopics(ELITE_BOOK_CONTENT[chapter.chapter_number]?.markdown || "").map((topic, idx) => (
                            <li key={idx}>
                              <a 
                                href={`#${topic.id}`}
                                className="group flex items-center gap-3 py-1.5 text-[13px] font-bold text-zinc-400 hover:text-indigo-500 transition-colors"
                              >
                                <Hash size={12} className="text-zinc-300 dark:text-zinc-700 group-hover:text-indigo-400 transition-colors" />
                                <span className="truncate">{topic.title}</span>
                              </a>
                            </li>
                          ))}
                            {getChapterTopics(ELITE_BOOK_CONTENT[chapter.chapter_number]?.markdown || "").length === 0 && (
                              <li className="text-[10px] font-medium text-zinc-400 italic py-1">No topics yet.</li>
                            )}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
