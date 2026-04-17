import { MessageSquare, Sparkles, Send } from "lucide-react";

export default function AIChatPage() {
  return (
    <div className="page h-[calc(100vh-120px)] flex flex-col">
      <div className="page-header flex-none">
        <div>
          <h1 className="page-title">AI Book Chat</h1>
          <p className="page-subtitle">Discuss concepts, get summaries, and ask questions about your books.</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-sm mb-4">
         <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
               <MessageSquare size={32} />
            </div>
            <div>
               <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Start a conversation</h3>
               <p className="text-sm text-zinc-500 max-w-sm mt-1">Select a book from your library to start chatting with its content. Our AI can help you understand complex parts or quiz you on details.</p>
            </div>
            <button className="btn-primary">
               <Sparkles size={16} />
               Select a Book
            </button>
         </div>

         <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="relative">
               <input 
                 disabled
                 type="text" 
                 placeholder="Select a book first to enable chat..." 
                 className="w-full pl-4 pr-12 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none opacity-60 cursor-not-allowed" 
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-lg flex items-center justify-center">
                  <Send size={16} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
