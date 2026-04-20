"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronLeft, BookOpen, Layers, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalSearch } from "./global-search";

export function ReaderShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsSidebarOpen(false);
    }, 300);
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Find main content taking out the sidebar and nav
      const content = document.querySelector('main')?.innerText || "No content found to read.";
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup TTS on unmount
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#050505] overflow-hidden selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <header className="flex-shrink-0 z-[100] flex items-center justify-between px-6 h-16 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-[#050505]/70 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          {/* Hamburger Trigger (Always Visible) */}
          <button 
            onMouseEnter={handleMouseEnter}
            onClick={() => setIsMobileOpen(true)}
            className="p-2.5 -ml-2 text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-300 group"
          >
            <Menu size={22} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <a href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 rotate-[-5deg] group-hover:rotate-0 transition-transform cursor-pointer">
              <BookOpen size={20} />
            </div>
            <span className="font-black text-lg sm:text-2xl tracking-tight text-zinc-900 dark:text-zinc-50 uppercase italic">Nexus Ai</span>
          </a>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <GlobalSearch />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSpeech}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
            title={isSpeaking ? "Stop Voice" : "Listen to Page"}
          >
            {isSpeaking ? <VolumeX size={18} className="animate-pulse text-indigo-500" /> : <Volume2 size={18} />}
          </button>
          <ThemeToggle />
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-500/20 uppercase italic">
             {/* Fallback for avatar */}
             S
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Invisible Hover Trigger Strip */}
        <div 
          onMouseEnter={handleMouseEnter}
          className="fixed inset-y-0 left-0 w-4 z-[80] cursor-e-resize"
        />

        {/* Desktop Animated Sidebar Container */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] z-[85] pointer-events-none"
              />
              <motion.aside
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="fixed inset-y-0 left-0 z-[90] w-80 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl border-r border-zinc-200 dark:border-zinc-800/50 shadow-[20px_0_50px_rgba(0,0,0,0.1)] dark:shadow-[20px_0_50px_rgba(0,0,0,0.3)]"
              >
                <div className="h-full flex flex-col pt-20">
                  <div className="flex-1 overflow-hidden">
                    {sidebar}
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar (Standard Drawer) */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-zinc-900/60 z-[110] backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-[120] w-[85%] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl"
              >
                <div className="h-full flex flex-col">
                   <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                     <span className="font-black tracking-tighter text-xl">CURRICULUM</span>
                     <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                       <X size={20} />
                     </button>
                   </div>
                   <div className="flex-1 overflow-y-auto" onClick={() => setIsMobileOpen(false)}>
                     {sidebar}
                   </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Chapter Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#050505] relative w-full lg:min-w-0 flex flex-col items-center">
          {/* Refined Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          
          <div className="relative w-full pb-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
