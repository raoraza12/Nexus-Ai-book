"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Sparkles, Send, User, Bot, Loader2, BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MASTER_BOOK_ID, MASTER_BOOK_SLUG } from "@/lib/constants";
import { getApiBaseUrl } from "@/lib/api-config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string>(MASTER_BOOK_ID);
  const [profile, setProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("ai_model, preferred_persona, context_depth")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    }
    loadProfile();
  }, [supabase]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          book_id: selectedBook,
          model: profile?.ai_model || "gpt-3.5-turbo",
          persona: profile?.preferred_persona || "academic",
          context_depth: profile?.context_depth || 5
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content || "Sorry, I couldn't reach the brain core." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Connection to AI Agent failed. Please ensure the backend is running with a valid OpenAI API Key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page flex flex-col h-[calc(100vh-var(--top-nav-height)-1rem)] sm:h-[calc(100vh-var(--top-nav-height)-5rem)]">
      <header className="page-header shrink-0 mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title !text-2xl sm:!text-4xl">Nexus Intelligence</h1>
          <p className="page-subtitle">Deep Intelligence Layer • Active</p>
        </div>
        
        {/* Book Selector */}
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 sm:py-2.5 rounded-2xl shadow-sm self-start sm:self-auto">
           <BookOpen size={16} className="text-indigo-500" />
           <span className="text-[10px] font-black uppercase text-zinc-400">Context:</span>
           <span className="text-[10px] font-black uppercase text-zinc-900 dark:text-zinc-100">Mastering Agentic AI</span>
        </div>
      </header>

      <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] sm:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl shadow-indigo-500/5 relative min-h-0">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-sm mx-auto">
               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 rounded-[1.5rem] sm:rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 rotate-3 border-4 border-white dark:border-zinc-900">
                  <Sparkles size={32} className="sm:size-10" />
               </div>
               <div>
                  <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white uppercase italic">System Ready</h3>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-3 font-bold uppercase tracking-widest leading-relaxed">Ask anything about the curriculum. Summaries, code walkthroughs, or architectural deep-dives.</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {["AI Engineering Insights", "Explain Neural Networks", "Career in AI", "Key Tech Terms"].map(topic => (
                    <button 
                      key={topic}
                      onClick={() => setInput(`Tell me about ${topic}`)}
                      className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:border-indigo-500 hover:text-indigo-600 transition-all"
                    >
                      {topic}
                    </button>
                  ))}
               </div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex items-start gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                  msg.role === "user" ? "flex-reverse justify-end" : "justify-start"
                )}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-[1rem] sm:rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/20 border-2 border-white dark:border-zinc-900">
                      <Bot size={18} className="sm:size-6" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[88%] sm:max-w-[75%] px-5 py-4 sm:px-6 sm:py-5 rounded-[1.5rem] text-sm sm:text-base font-semibold",
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-500/20" 
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200/50 dark:border-zinc-800/50 leading-relaxed"
                  )}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-[1rem] sm:rounded-2xl bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0 shadow-sm">
                      <User size={18} className="sm:size-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {isLoading && (
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                  <Bot size={24} />
               </div>
               <div className="bg-zinc-100 dark:bg-zinc-900 px-6 py-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin text-indigo-600" />
                  <span className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-[0.2em] italic">Nexus Neural Processing...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-8 bg-zinc-50 dark:bg-zinc-950/20 border-t border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
           <div className="relative max-w-4xl mx-auto group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your neural agent anything..." 
                className="w-full pl-6 pr-16 py-4 sm:py-6 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] sm:rounded-[2rem] text-sm sm:text-lg font-bold focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-xl shadow-black/5" 
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-indigo-600 text-white rounded-[1rem] sm:rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/30 active:scale-95"
              >
                <Send size={20} />
              </button>
           </div>
           <p className="text-[10px] text-zinc-400 text-center mt-5 font-black uppercase tracking-[0.3em] italic">
              AI Engine 1.1 • Curated from Nexus Data Core
           </p>
        </div>
      </div>
    </div>
  );
}
