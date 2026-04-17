"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, History, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  searchChapters, 
  getSearchHistory, 
  addToHistory, 
  removeFromHistory, 
  SearchResult 
} from "@/lib/search-utils";
import { MASTER_BOOK_SLUG } from "@/lib/constants";
import { LanguageSelector } from "./language-selector";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setHistory(getSearchHistory());
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length >= 2) {
      setResults(searchChapters(val));
      setIsOpen(true);
    } else {
      setResults([]);
    }
  };

  const navigateToChapter = (chapter: number, q: string) => {
    addToHistory(q);
    setIsOpen(false);
    setQuery("");
    router.push(`/reader/${MASTER_BOOK_SLUG}/${chapter}`);
  };

  const clearHistory = (q: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromHistory(q);
    setHistory(getSearchHistory());
  };

  return (
    <div className="flex-1 max-w-xl flex items-center gap-3" ref={dropdownRef}>
      <div className="relative flex-1 group">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search topics, chapters, keywords..."
          className="w-full bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-black rounded-2xl py-3 pl-12 pr-12 text-sm font-semibold transition-all outline-none shadow-sm hover:shadow-md"
        />
        {query && (
          <button 
            onClick={() => { setQuery(""); setResults([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            <X size={14} />
          </button>
        )}
        <kbd className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 items-center gap-1 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-[10px] font-bold text-zinc-400 pointer-events-none">
          <span className="text-xs">⌘</span>K
        </kbd>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-full mt-3 inset-x-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] overflow-hidden backdrop-blur-xl"
            >
              {/* Recent Searches Section */}
              {query.length < 2 && history.length > 0 && (
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 px-2">
                    <History size={12} /> Recent Searches
                  </div>
                  <div className="space-y-1">
                    {history.map((h, i) => (
                      <div 
                        key={i}
                        onClick={() => handleSearch(h)}
                        className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white dark:hover:bg-zinc-800 cursor-pointer transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <Clock size={14} className="text-zinc-300 dark:text-zinc-600" />
                          <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{h}</span>
                        </div>
                        <button 
                          onClick={(e) => clearHistory(h, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-all font-bold text-[10px]"
                        >
                          REMOVE
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {results.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-4 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">
                      Chapter Results
                    </div>
                    {results.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => navigateToChapter(res.chapterNumber, query)}
                        className="w-full text-left p-4 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 group transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[9px] font-black text-zinc-500 uppercase tracking-tighter">Chapter {res.chapterNumber}</span>
                               {res.matchType === 'title' && <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Title Match</span>}
                            </div>
                            <h4 className="text-sm font-black text-zinc-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase italic">{res.title}</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium line-clamp-2 italic">
                               {res.snippet}
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query.length >= 2 ? (
                  <div className="py-12 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mx-auto mb-4 border border-zinc-100 dark:border-zinc-800">
                       <Search size={24} className="text-zinc-300" />
                    </div>
                    <p className="font-black text-zinc-900 dark:text-white uppercase italic">No matches found</p>
                    <p className="text-xs text-zinc-500 mt-1 font-bold">Try searching for concepts like "RAG", "LLM", or "Decision Engines".</p>
                  </div>
                ) : !history.length && (
                   <div className="py-8 px-6 text-center">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Type to start searching Nexus Ai</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                 <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Deep Search Protocol Active</span>
                 <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-400">
                    <span className="flex items-center gap-1.5"><ArrowRight size={10} className="rotate-90" /> Navigate</span>
                    <span className="flex items-center gap-1.5"><kbd className="px-1 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900">ESC</kbd> Close</span>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LanguageSelector />
    </div>
  );
}
