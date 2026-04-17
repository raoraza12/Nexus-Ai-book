"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Flame, 
  Target, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Save
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
  const [readingGoal, setReadingGoal] = useState(3); // Chapters per week
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
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // In a real app, we'd persist readingGoal to Supabase here
    setTimeout(() => setSaving(false), 800);
  };

  const firstLetter = profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "R";

  if (loading) return <div className="p-10 animate-pulse space-y-4">
    <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
    <div className="h-64 w-full bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
  </div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-10 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic mb-2">
          Settings
        </h1>
        <p className="text-zinc-500 font-medium tracking-wide">Customize your Nexus Ai experience.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        {/* Sidebar Nav (Mobile Horizontal Scrollable) */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
          {["Account", "Reading", "AI Agent", "Security"].map((item) => (
            <button 
                key={item} 
                className={cn(
                    "px-4 py-2 lg:px-4 lg:py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all",
                    item === "Account" || item === "Reading" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="lg:col-span-9 space-y-10">
          {/* Profile Section */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-6">
               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shrink-0 uppercase italic">
                 {firstLetter}
               </div>
               <div>
                 <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase italic">{profile?.full_name || "Nexus Reader"}</h3>
                 <p className="text-sm text-zinc-500 font-medium mb-3">{profile?.email}</p>
                 <button className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors uppercase">Edit Identity</button>
               </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Appearance */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">Interface Theme</h4>
                    <p className="text-xs text-zinc-500">Choose between dark and light mode</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>

              {/* Language Preference */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                     <Globe size={18} />
                   </div>
                   <div>
                     <h4 className="font-bold text-zinc-900 dark:text-white">Book Language</h4>
                     <p className="text-xs text-zinc-500">Preferred AI translation target</p>
                   </div>
                </div>
                <select 
                   value={language} 
                   onChange={(e) => setLanguage(e.target.value as any)}
                   className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                   <option value="en">English</option>
                   <option value="ur">Urdu</option>
                   <option value="ar">Arabic</option>
                   <option value="es">Spanish</option>
                </select>
              </div>

              {/* Reading Goal */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Target size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">Reading Goal</h4>
                      <p className="text-xs text-zinc-500">Target chapters per week</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">
                    {readingGoal} / week
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={readingGoal} 
                  onChange={(e) => setReadingGoal(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                  <span>Slow</span>
                  <span>Steady</span>
                  <span>Mastery</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </section>

          {/* Security & Danger Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group hover:border-indigo-500/50 transition-all cursor-pointer">
                <ShieldCheck className="text-zinc-400 mb-4 group-hover:text-indigo-500 transition-colors" size={24} />
                <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Key Security</h4>
                <p className="text-xs text-zinc-500">Manage API keys & access</p>
             </div>
             <div className="p-6 rounded-3xl border border-red-100 dark:border-red-900/20 bg-red-50/30 dark:bg-red-900/10 group hover:border-red-500/50 transition-all cursor-pointer">
                <LogOut className="text-red-400 mb-4 group-hover:text-red-500 transition-colors" size={24} />
                <h4 className="font-bold text-red-600 dark:text-red-400 mb-1">Sign Out</h4>
                <p className="text-xs text-red-400/60">Logout from this node</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
