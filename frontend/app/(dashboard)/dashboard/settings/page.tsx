"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Settings as SettingsIcon, 
  Target, 
  Globe, 
  Sparkles, 
  Save,
  CheckCircle2,
  Shield,
  Bot,
  BrainCircuit,
  Lock,
  LogOut,
  AppWindow,
  Key,
  Cpu,
  ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/context/language-context";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type TabType = "account" | "reading" | "ai-agent" | "security";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // New settings states
  const [readingGoal, setReadingGoal] = useState(3);
  const [aiModel, setAiModel] = useState("gpt-3.5-turbo");
  const [contextDepth, setContextDepth] = useState(5);
  const [persona, setPersona] = useState("academic");
  
  const [activeTab, setActiveTab] = useState<TabType>("account");
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
        
        if (data) {
          setProfile(data);
          if (data.reading_goal) setReadingGoal(data.reading_goal);
          if (data.ai_model) setAiModel(data.ai_model);
          if (data.context_depth) setContextDepth(data.context_depth);
          if (data.preferred_persona) setPersona(data.preferred_persona);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          reading_goal: readingGoal,
          ai_model: aiModel,
          context_depth: contextDepth,
          preferred_persona: persona,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (!error) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    }
    
    setSaving(false);
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

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "account", label: "Account", icon: User },
    { id: "reading", label: "Reading", icon: Target },
    { id: "ai-agent", label: "AI Agent", icon: Bot },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="page-header mb-8 sm:mb-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl sm:text-6xl lg:text-[4rem] font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-tight uppercase italic pointer-events-none select-none">
            Settings
          </h1>
          <p className="text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] italic">
            Customize your Nexus Ai experience
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start relative pb-20">
        
        {/* Tab Navigation */}
        <nav className="w-full lg:w-64 sticky top-20 z-10 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 rounded-2xl font-black text-sm uppercase italic tracking-widest transition-all duration-300",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                    : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="hidden lg:block" />}
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="flex-1 w-full min-w-0 animate-in fade-in slide-in-from-right-4 duration-500">
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 relative group">
            
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="animate-in fade-in duration-500">
                <div className="p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800/50">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-600/30 rotate-3 shrink-0 uppercase italic border-4 border-white dark:border-zinc-900">
                    {profile?.full_name?.charAt(0) || "R"}
                  </div>
                  <div className="text-center sm:text-left flex-1 min-w-0">
                    <h3 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tight truncate mb-1">
                      {profile?.full_name || "Nexus Reader"}
                    </h3>
                    <p className="text-sm font-bold text-zinc-500 mb-6 truncate">{profile?.email}</p>
                    <button className="px-6 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 hover:border-indigo-500 hover:text-indigo-600 transition-all">
                      Edit Identity
                    </button>
                  </div>
                </div>

                <div className="p-8 sm:p-12 space-y-12">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 shadow-sm">
                            <Sparkles size={18} />
                          </div>
                          <label className="font-black text-[10px] text-zinc-400 uppercase tracking-widest italic">Interface Theme</label>
                        </div>
                        <ThemeToggle />
                        <p className="text-[10px] font-bold text-zinc-400 italic">Choose between dark and light mode</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shadow-sm">
                            <Globe size={18} />
                          </div>
                          <label className="font-black text-[10px] text-zinc-400 uppercase tracking-widest italic">Book Language</label>
                        </div>
                        <select 
                          value={language} 
                          onChange={(e) => setLanguage(e.target.value as any)}
                          className="w-full bg-zinc-100/50 dark:bg-zinc-800/50 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm font-black focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option value="en">English (Default)</option>
                          <option value="ur">Urdu (AI Optimized)</option>
                          <option value="ar">Arabic (Technical)</option>
                          <option value="es">Spanish (Simplified)</option>
                        </select>
                        <p className="text-[10px] font-bold text-zinc-400 italic">Preferred AI translation target</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* Reading Tab */}
            {activeTab === "reading" && (
              <div className="p-8 sm:p-12 animate-in fade-in duration-500 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 dark:border-emerald-800">
                        <Target size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-zinc-900 dark:text-white uppercase italic tracking-tight">Reading Goal</h4>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Target chapters per week</p>
                      </div>
                    </div>
                    <span className="text-3xl font-black text-indigo-600 italic">
                      {readingGoal}
                    </span>
                  </div>
                  
                  <div className="pt-6">
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={readingGoal} 
                      onChange={(e) => setReadingGoal(parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-600 shadow-inner"
                    />
                    <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] px-1 mt-4">
                      <span>Casual</span>
                      <span>Elite</span>
                      <span>Master</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700">
                   <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                     * Reading goals help our AI prioritize your content recommendations and reading streak calculations.
                   </p>
                </div>
              </div>
            )}

            {/* AI Agent Tab */}
            {activeTab === "ai-agent" && (
              <div className="p-8 sm:p-12 animate-in fade-in duration-500 space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
                            <Cpu size={18} />
                          </div>
                          <label className="font-black text-[10px] text-zinc-400 uppercase tracking-widest italic">Core Logic Model</label>
                        </div>
                        <select 
                          value={aiModel} 
                          onChange={(e) => setAiModel(e.target.value)}
                          className="w-full bg-zinc-100/50 dark:bg-zinc-800/50 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm font-black focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option value="gpt-3.5-turbo">GPT-3.5 Standard (Fast)</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo (Elite)</option>
                          <option value="gpt-4o">GPT-4o (Multimodal)</option>
                        </select>
                        <p className="text-[10px] font-bold text-zinc-400 italic">Select the neural network powering your agent</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 shadow-sm border border-purple-100 dark:border-purple-800/50">
                            <Bot size={18} />
                          </div>
                          <label className="font-black text-[10px] text-zinc-400 uppercase tracking-widest italic">Agent Persona</label>
                        </div>
                        <select 
                          value={persona} 
                          onChange={(e) => setPersona(e.target.value)}
                          className="w-full bg-zinc-100/50 dark:bg-zinc-800/50 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm font-black focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option value="academic">Academic / Technical</option>
                          <option value="creative">Creative / Exploratory</option>
                          <option value="mentor">Empathetic Mentor</option>
                          <option value="concise">Ultra-Concise</option>
                        </select>
                        <p className="text-[10px] font-bold text-zinc-400 italic">Tone and behavioral profile of the AI</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400 shadow-sm border border-zinc-100 dark:border-zinc-800/50">
                            <BrainCircuit size={18} />
                          </div>
                          <div>
                            <label className="font-black text-[10px] text-zinc-400 uppercase tracking-widest italic">Context Memory Depth</label>
                            <p className="text-[10px] font-bold text-zinc-400 italic italic uppercase">Tokens reserved for conversation history</p>
                          </div>
                        </div>
                        <span className="text-xl font-black text-indigo-600 italic">{contextDepth} MSG</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={contextDepth} 
                      onChange={(e) => setContextDepth(parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-600 shadow-inner"
                    />
                 </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="p-8 sm:p-12 animate-in fade-in duration-500 space-y-12">
                 <div className="space-y-6">
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Identity & Security Protocols</h4>
                    
                    <div className="space-y-4">
                       {[
                         { icon: Key, label: "Access Tokens", desc: "Manage API keys and authentication secrets", action: "Manage" },
                         { icon: AppWindow, label: "Session History", desc: "Monitor active devices and login locations", action: "View" },
                         { icon: Lock, label: "Password Reset", desc: "Update your biometric or text-based access", action: "Update" }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 group/item hover:bg-white dark:hover:bg-zinc-800 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center text-zinc-400 group-hover/item:text-indigo-500 transition-colors">
                                  <item.icon size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-zinc-900 dark:text-white uppercase italic">{item.label}</p>
                                  <p className="text-[10px] font-bold text-zinc-500">{item.desc}</p>
                               </div>
                            </div>
                            <button className="px-4 py-2 text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-all">
                               {item.action}
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <button className="flex items-center gap-3 px-6 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/20 transition-all">
                       <LogOut size={16} />
                       Terminate All Sessions
                    </button>
                 </div>
              </div>
            )}

            {/* Global Actions Footer */}
            <div className="p-8 sm:px-12 sm:py-10 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="hidden sm:block">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
                  Last Sync: {new Date().toLocaleDateString()}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Profile Active</span>
                </div>
              </div>
              
              <button 
                onClick={handleSave}
                disabled={saving}
                className={cn(
                  "w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 rounded-[1.5rem] font-black text-lg uppercase italic transition-all active:scale-95 shadow-2xl",
                  showSuccess 
                    ? "bg-emerald-600 text-white shadow-emerald-600/30" 
                    : "bg-indigo-600 text-white shadow-indigo-600/40 hover:bg-indigo-700 hover:-translate-y-1"
                )}
              >
                {saving ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Syncing...</span>
                  </div>
                ) : showSuccess ? (
                  <><CheckCircle2 size={24} /> Applied</>
                ) : (
                  <><Save size={24} /> Save Profile</>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>

      <footer className="mt-20 sm:mt-32 text-center pb-20">
         <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.4em] italic mb-4 opacity-50">
            Nexus Ai Book Core v1.1.0 • Built for Senior Architects
         </p>
         <div className="h-px w-20 bg-zinc-200 dark:bg-zinc-800 mx-auto" />
      </footer>
    </div>
  );
}
