"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, Monitor } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Theme = "light" | "dark" | "system";

export function ThemeToggle({ userId }: { userId?: string }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) applyTheme(saved);
  }, []);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("theme", t);

    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else if (t === "light") {
      root.classList.remove("dark");
    } else {
      // system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) root.classList.add("dark");
      else root.classList.remove("dark");
    }
  };

  const handleThemeChange = async (newTheme: Theme) => {
    applyTheme(newTheme);

    // Persist to Supabase if user is logged in
    if (userId) {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({ theme: newTheme })
        .eq("id", userId);
      router.refresh();
    }
  };

  if (!mounted) return null;

  const options: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <Sun size={14} />, label: "Light" },
    { value: "system", icon: <Monitor size={14} />, label: "System" },
    { value: "dark", icon: <Moon size={14} />, label: "Dark" },
  ];

  return (
    <div className="inline-flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/50 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-zinc-700/50" role="group" aria-label="Theme selector">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleThemeChange(opt.value)}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
            theme === opt.value 
              ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600" 
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
          title={opt.label}
          aria-pressed={theme === opt.value}
          id={`theme-${opt.value}`}
        >
          {opt.icon}
          <span className="sr-only">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
