"use client";

import { ELITE_BOOK_CONTENT } from "@/lib/book-content";
import { ChevronLeft, ChevronRight, Loader2, Sparkles, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect, use } from "react";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { NexusCoreAgent } from "@/components/reader/nexus-core-agent";

export default function ChapterPage({
  params,
}: {
  params: Promise<{ book_id: string; chapter_num: string }>;
}) {
  const { book_id, chapter_num } = use(params);
  const chapterNumber = parseInt(chapter_num);
  const totalChapters = 8;

  const { language, setIsTranslating } = useLanguage();
  
  const content = ELITE_BOOK_CONTENT[chapterNumber] || {
    title: `Chapter ${chapterNumber}`,
    markdown: `Coming Soon... \n\n This chapter is currently being drafted by our Lead AI Engineers. Check back shortly for Senior-level insights.`
  };

  const [displayMarkdown, setDisplayMarkdown] = useState(content.markdown);
  const [localTranslating, setLocalTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  useEffect(() => {
    async function translate() {
      if (language === "en") {
        setDisplayMarkdown(content.markdown);
        return;
      }

      setLocalTranslating(true);
      setTranslationError(null);
      setIsTranslating(true);
      try {
        const { getApiBaseUrl } = await import("@/lib/api-config");
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/v1/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: content.markdown,
            target_lang: language,
          }),
        });

        if (!response.ok) {
           const errorData = await response.json().catch(() => ({}));
           throw new Error(errorData.detail || "Neural link timeout. Please retry.");
        }

        const data = await response.json();
        if (data.translated_text) {
          setDisplayMarkdown(data.translated_text);
        }
      } catch (err: any) {
        console.error("Translation error:", err);
        setTranslationError(err.message || "Failed to connect to Neural Core.");
      } finally {
        setLocalTranslating(false);
        setIsTranslating(false);
      }
    }
    translate();
    // Scroll to top on chapter change
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [language, chapter_num]);

  return (
    <div className="w-full flex justify-center bg-slate-50/50 dark:bg-transparent min-h-screen">
      <article className="w-full max-w-4xl px-4 sm:px-8 md:px-12 py-8 sm:py-16 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Progress & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-widest uppercase border border-indigo-100 dark:border-indigo-500/20">
              <BookOpen size={12} /> Chapter {chapterNumber} of {totalChapters}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white leading-[1.1] tracking-tighter uppercase italic">
              {content.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
            <Clock size={14} /> 12 min read
          </div>
        </div>

        <div className="relative">
          {localTranslating && (
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md z-20 flex items-center justify-center rounded-3xl min-h-[400px]">
              <div className="bg-white dark:bg-zinc-900 px-8 py-5 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 animate-in zoom-in-95 duration-300">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
                <span className="text-sm font-black text-zinc-900 dark:text-white uppercase italic tracking-widest">Nexus Neural Core: Translating...</span>
              </div>
            </div>
          )}

          {translationError && (
             <div className="mb-8 p-6 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/30 rounded-3xl flex flex-col items-center text-center gap-4 animate-in slide-in-from-top-4">
                <div className="text-red-600 font-black uppercase text-xs tracking-widest italic flex items-center gap-2">
                   <Sparkles size={16} /> Neural Link Error
                </div>
                <p className="text-sm font-bold text-red-500/80">{translationError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                  Reconnect Neural Link
                </button>
             </div>
          )}

          <div className={cn(
            "prose prose-zinc dark:prose-invert max-w-none transition-opacity duration-500",
            localTranslating ? "opacity-20" : "opacity-100",
            "prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:italic",
            "prose-h2:text-2xl sm:prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-zinc-100 dark:prose-h2:border-zinc-800 prose-h2:pb-4",
            "prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-10",
            "prose-p:text-base sm:prose-p:text-xl prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400 font-medium",
            "prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100",
            "prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-indigo-50 dark:prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-bold prose-code:before:content-none prose-code:after:content-none",
            "prose-pre:bg-zinc-900 dark:prose-pre:bg-black prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:p-4 sm:prose-pre:p-8 prose-pre:shadow-2xl",
            "prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic",
            "prose-img:rounded-3xl prose-img:shadow-2xl"
          )}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ ...props }) => {
                  const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  return <h2 id={id} {...props} />;
                },
                h3: ({ ...props }) => {
                  const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  return <h3 id={id} {...props} />;
                }
              }}
            >
              {displayMarkdown}
            </ReactMarkdown>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="mt-20 sm:mt-32 pt-10 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          {chapterNumber > 1 ? (
            <Link
              href={`/reader/${book_id}/${chapterNumber - 1}`}
              className="group flex flex-col gap-2 items-start p-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all duration-500 w-full sm:max-w-[280px]"
            >
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 group-hover:-translate-x-1 transition-transform">
                <ChevronLeft size={16} /> Previous Terminal
              </span>
              <span className="text-base font-black text-zinc-900 dark:text-zinc-100 truncate w-full uppercase italic">
                {ELITE_BOOK_CONTENT[chapterNumber - 1]?.title || `Chapter ${chapterNumber - 1}`}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block flex-1" /> 
          )}

          {chapterNumber < totalChapters ? (
            <Link
              href={`/reader/${book_id}/${chapterNumber + 1}`}
              className="group flex flex-col gap-2 items-end p-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-zinc-900/50 backdrop-blur-sm transition-all duration-500 w-full sm:max-w-[280px]"
            >
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Next Phase <ChevronRight size={16} />
              </span>
              <span className="text-base font-black text-zinc-900 dark:text-zinc-100 truncate w-full text-right uppercase italic">
                {ELITE_BOOK_CONTENT[chapterNumber + 1]?.title || `Chapter ${chapterNumber + 1}`}
              </span>
            </Link>
          ) : (
            <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
               <div className="px-8 py-5 bg-emerald-500 text-white rounded-3xl font-black uppercase italic tracking-widest shadow-xl shadow-emerald-500/20 text-sm">
                  Curriculum Mastered 🎉
               </div>
               <Link href="/dashboard/learn" className="text-xs font-bold text-zinc-400 hover:text-indigo-500 transition-colors uppercase tracking-widest underline decoration-dashed underline-offset-4">
                  Take Final assessment
               </Link>
            </div>
          )}
        </div>
      </article>

      <NexusCoreAgent bookId={book_id} currentContent={displayMarkdown} />
    </div>
  );
}
