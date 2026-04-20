"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageSquare,
  Minimize2,
  Maximize2,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getApiBaseUrl } from "@/lib/api-config";

import { createClient } from "@/lib/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface NexusCoreAgentProps {
  bookId: string;
  currentContent: string;
}

export function NexusCoreAgent({ bookId, currentContent }: NexusCoreAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`nexus_chat_${bookId}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
  }, [bookId]);

  // Fetch profile settings
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

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`nexus_chat_${bookId}`, JSON.stringify(messages));
    }
  }, [messages, bookId]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Create a context-aware prompt
      const contextPrompt = `
Context from current book page:
---
${currentContent.substring(0, 3000)} 
---
User is reading this chapter and has a question: ${input}`;

      const baseUrl = getApiBaseUrl();
      console.log(`Nexus Core: Connecting to ${baseUrl}/api/v1/chat...`);
      
      const response = await fetch(`${baseUrl}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.slice(-(profile?.context_depth || 5)), 
            { role: "user", content: contextPrompt }
          ],
          book_id: bookId,
          model: profile?.ai_model || "gpt-3.5-turbo",
          persona: profile?.preferred_persona || "academic",
          context_depth: profile?.context_depth || 5
        }),
      });

      if (!response.ok) {
        let errorDetail = "";
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
        } catch (e) {
          errorDetail = await response.text().catch(() => "Unknown server error");
        }
        throw new Error(`Neural Link Error (${response.status}): ${errorDetail.substring(0, 100)}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content || "Neural links unstable. Please retry." }]);
    } catch (error: any) {
      console.error("Nexus Core Error:", error);
      const errorMsg = error.message || "Edge Protocol Error: Could not connect to Nexus Brain.";
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Clear this conversation?")) {
      setMessages([]);
      localStorage.removeItem(`nexus_chat_${bookId}`);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[90vw] sm:w-[400px] h-auto max-h-[calc(100vh-120px)] sm:h-[600px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden glass"
          >
            {/* Header */}
            <div className="p-6 bg-indigo-600 dark:bg-indigo-600/20 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase italic tracking-tighter">Nexus Core</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Neural Link Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearHistory}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
                  title="Clear Core Memory"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
                   <div className="w-16 h-16 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-600/20">
                      <MessageSquare size={32} />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">
                      System Operational. <br /> Ask me about this chapter.
                   </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                      msg.role === "assistant" 
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20" 
                        : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                    )}>
                      {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-semibold max-w-[80%] leading-relaxed",
                      msg.role === "assistant"
                        ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200/50 dark:border-zinc-800/50"
                        : "bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/10"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3 animate-in fade-in duration-300">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                    <Bot size={16} />
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 border border-dashed border-indigo-500/30">
                     <Loader2 size={12} className="animate-spin text-indigo-600" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Core Processing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800">
               <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Inquire with Nexus Core..."
                    className="w-full pl-5 pr-12 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
                  >
                    <Send size={16} />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 border-4 border-white dark:border-zinc-900",
          isOpen 
            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rotate-90" 
            : "bg-indigo-600 text-white rotate-0 shadow-indigo-600/40"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <Minimize2 size={28} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <Sparkles size={28} className="animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
