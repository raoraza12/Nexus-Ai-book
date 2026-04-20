"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Target, 
  Globe, 
  Sparkles, 
  Save,
  CheckCircle2
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/context/language-context";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [readingGoal, setReadingGoal] = useState(3);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    // In a real app, save to Supabase
    setTimeout(() => {
      setSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  if (loading) return (
    <div className="p-10 animate-pulse space-y-8 max-w-2xl mx-auto">
      <div className="h-14 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-40 w-full bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
        <div className="h-40 w-full bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
      </div>
    </div>
  );

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">
            Settings
          </h1>
          <p className="page-subtitle">Manage your Nexus AI identity and preferences.</p>
        </div>
      </header>

      <div className="space-y-6 sm:space-y-8">
        
        {/* Profile Identity */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl shadow-indigo-500/5">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 bg-zinc-50 dark:bg-zinc-950/50 w-full">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-600/30 rotate-3 shrink-0 uppercase italic">
              {profile?.full_name?.charAt(0) || "R"}
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tight truncate">{profile?.full_name || "Nexus Reader"}</h3>
              <p className="text-sm font-medium text-zinc-500 mb-4 truncate">{profile?.email}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                 System Active
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Appearance & Language Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                      <Sparkles size={18} />
                    </div>
                    <label className="font-black text-xs text-zinc-400 uppercase tracking-widest italic">Interface Theme</label>
                  </div>
                  <ThemeToggle />
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                      <Globe size={18} />
                    </div>
                    <label className="font-black text-xs text-zinc-400 uppercase tracking-widest italic">Book Language</label>
                  </div>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none cursor-pointer"
                  >
                    <option value="en">English (Default)</option>
                    <option value="ur">Urdu (AI Optimized)</option>
                    <option value="ar">Arabic (Technical)</option>
                    <option value="es">Spanish (Simplified)</option>
                  </select>
               </div>
            </div>

            {/* Reading Goal */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                    <Target size={18} />
                  </div>
                  <label className="font-black text-xs text-zinc-400 uppercase tracking-widest italic">Reading Velocity</label>
                </div>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 italic">
                  {readingGoal} Chapters / week
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={readingGoal} 
                onChange={(e) => setReadingGoal(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] px-1">
                <span>Steady</span>
                <span>Elite</span>
                <span>Mastery</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-400 font-medium italic text-center sm:text-left">
              Last identity sync: {new Date().toLocaleDateString()}
            </p>
            <button 
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-3.5 rounded-2xl font-black text-base uppercase italic transition-all active:scale-95 shadow-2xl",
                showSuccess 
                  ? "bg-emerald-600 text-white shadow-emerald-600/20" 
                  : "bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700"
              )}
            >
              {saving ? (
                "Processing..."
              ) : showSuccess ? (
                <><CheckCircle2 size={18} /> Applied!</>
              ) : (
                <><Save size={18} /> Save Preferences</>
              )}
            </button>
          </div>
        </section>
      </div>

      <footer className="mt-12 text-center pb-10">
         <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.25em]">
            Nexus Ai Book Core v1.1.0 • Built for Senior Architects
         </p>
      </footer>
    </div>
  );
}
