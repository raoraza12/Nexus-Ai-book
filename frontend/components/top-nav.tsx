"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, LogOut, Search, User, Menu, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "./global-search";

interface TopNavProps {
  user: {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
  onMenuClick?: () => void;
}

export function TopNav({ user, onMenuClick }: TopNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="fixed top-0 inset-x-0 h-16 z-40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center shrink-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 sm:gap-6">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Branding */}
        <a href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 rotate-[-5deg] group-hover:rotate-0 transition-transform cursor-pointer">
                <BookOpen size={18} />
            </div>
            <span className="font-black text-sm tracking-tight text-zinc-900 dark:text-zinc-50 uppercase italic">Nexus Ai</span>
        </a>
        {/* Functional Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
           <GlobalSearch />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <ThemeToggle userId={user?.id} />

          <button
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all relative"
            aria-label="Notifications"
            id="notifications-btn"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-black" />
          </button>

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block mx-1" />

          {/* User Profile */}
          <div className="flex items-center gap-3">
             <div className="text-right hidden lg:block">
               <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-none">{user?.full_name ?? "Reader"}</p>
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Level 4 Citizen</p>
             </div>
             
             <div className="w-10 h-10 rounded-full ring-2 ring-zinc-100 dark:ring-zinc-800 overflow-hidden hover:ring-indigo-500 transition-all flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 group cursor-pointer shadow-sm">
               {user?.avatar_url ? (
                 <img
                   src={user.avatar_url}
                   alt={user.full_name ?? "User avatar"}
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                 />
               ) : (
                 <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                   {initials}
                 </span>
               )}
             </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            aria-label="Sign out"
            id="logout-btn"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
