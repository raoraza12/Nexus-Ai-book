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
  isCollapsed?: boolean;
}

export function TopNav({ user, onMenuClick, isCollapsed }: TopNavProps) {
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
    <header className={cn(
      "fixed top-0 right-0 h-16 z-40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center transition-all duration-400",
      isCollapsed ? "lg:left-[80px]" : "lg:left-[280px]",
      "left-0"
    )}>
      <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        {/* Branding (Mobile Only) */}
        <a href="/" className="flex lg:hidden items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <BookOpen size={16} />
            </div>
            <span className="font-black text-xs uppercase italic text-zinc-900 dark:text-zinc-50">Nexus</span>
        </a>

        {/* Functional Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
           <GlobalSearch />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <ThemeToggle userId={user?.id} />

          <button
            className="p-2.5 rounded-xl text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-zinc-950" />
          </button>

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block mx-1" />

          {/* User Profile */}
          <div className="flex items-center gap-3 group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 pl-2 pr-1 py-1 rounded-2xl transition-all">
             <div className="text-right hidden sm:block leading-tight">
               <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase italic truncate max-w-[120px]">
                 {user?.full_name?.split(" ")[0] ?? "Reader"}
               </p>
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Level 4</p>
             </div>
             
             <div className="w-10 h-10 rounded-xl ring-2 ring-zinc-100 dark:ring-zinc-800 overflow-hidden group-hover:ring-indigo-500 transition-all flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 shadow-sm relative">
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
            className="p-2.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            aria-label="Sign out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
