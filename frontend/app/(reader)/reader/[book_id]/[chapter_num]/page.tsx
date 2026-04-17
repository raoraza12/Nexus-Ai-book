"use client";

import { ELITE_BOOK_CONTENT } from "@/lib/book-content";
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect, use } from "react";
import { useLanguage } from "@/context/language-context";

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

  useEffect(() => {
    async function translate() {
      if (language === "en") {
        setDisplayMarkdown(content.markdown);
        return;
      }

      setLocalTranslating(true);
      setIsTranslating(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: content.markdown,
            target_lang: language,
          }),
        });
        const data = await response.json();
        if (data.translated_text) {
          setDisplayMarkdown(data.translated_text);
        }
      } catch (err) {
        console.error("Translation error:", err);
      } finally {
        setLocalTranslating(false);
        setIsTranslating(false);
      }
    }
    translate();
  }, [language, chapter_num]);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:px-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Chapter Meta */}
      <div className="mb-6 sm:mb-10 block">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] sm:text-[10px] font-black tracking-[0.2em] uppercase mb-4 border border-indigo-100/50 dark:border-indigo-500/20 shadow-sm">
          Chapter {chapterNumber} • {content.title}
        </div>
      </div>

      <div className="prose prose-zinc dark:prose-invert 
        prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:italic
        prose-h1:text-3xl sm:prose-h1:text-5xl 
        prose-h2:text-2xl sm:prose-h2:text-3xl 
        prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed
        prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline 
        prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:p-4 sm:prose-pre:p-6
        prose-img:rounded-2xl max-w-none">
        {localTranslating && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-3xl">
            <div className="bg-white dark:bg-zinc-900 px-6 py-4 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 animate-in zoom-in-95 duration-300">
              <Loader2 className="animate-spin text-indigo-600" size={20} />
              <span className="text-sm font-black text-zinc-900 dark:text-white uppercase italic tracking-wider">Nexus Ai Translating...</span>
            </div>
          </div>
        )}

        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ node, ...props }) => {
              const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return <h2 id={id} {...props} />;
            },
            h3: ({ node, ...props }) => {
              const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return <h3 id={id} {...props} />;
            }
          }}
        >
          {displayMarkdown}
        </ReactMarkdown>
      </div>

      {/* Pagination Footer */}
      <div className="mt-12 sm:mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {chapterNumber > 1 ? (
          <Link
            href={`/reader/${book_id}/${chapterNumber - 1}`}
            className="group flex flex-col gap-1 items-start px-5 sm:px-6 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 w-full sm:max-w-[240px]"
          >
            <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
              <ChevronLeft size={14} /> Previous
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate w-full relative z-10">
              Chapter {chapterNumber - 1}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" /> 
        )}

        {chapterNumber < totalChapters ? (
          <Link
            href={`/reader/${book_id}/${chapterNumber + 1}`}
            className="group flex flex-col gap-1 items-end px-5 sm:px-6 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-zinc-900/50 backdrop-blur-sm transition-all duration-300 w-full sm:max-w-[240px]"
          >
            <span className="text-[10px] sm:text-xs font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Next <ChevronRight size={14} />
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate w-full text-right relative z-10">
              Chapter {chapterNumber + 1}
            </span>
          </Link>
        ) : (
          <button className="flex items-center justify-center gap-2 px-6 py-4 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold cursor-default opacity-80 text-sm w-full sm:w-auto">
            Course Completed 🎉
          </button>
        )}
      </div>
    </article>
  );
}
