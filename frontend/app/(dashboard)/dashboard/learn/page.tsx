import { GraduationCap, Trophy, Play, Book } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Learning Hub</h1>
          <p className="page-subtitle">Courses and interactive guides to help you read and learn effectively.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm group hover:border-indigo-500 transition-colors">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
               <Play className="text-amber-600 fill-amber-600" size={20} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Reading Speed Masterclass</h3>
            <p className="text-sm text-zinc-500 mb-4">Learn techniques to double your reading speed without losing comprehension.</p>
            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
               <span className="flex items-center gap-1"><Clock size={12} /> 2.5 Hours</span>
               <span className="flex items-center gap-1"><Book size={12} /> 12 Lessons</span>
            </div>
         </div>

         <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm group hover:border-indigo-500 transition-colors">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
               <Trophy className="text-violet-600" size={20} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Active Recall Basics</h3>
            <p className="text-sm text-zinc-500 mb-4">The science of remembering what you read through active testing and retrieval.</p>
            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
               <span className="flex items-center gap-1"><Clock size={12} /> 1.5 Hours</span>
               <span className="flex items-center gap-1"><Book size={12} /> 8 Lessons</span>
            </div>
         </div>
      </div>
    </div>
  );
}

import { Clock } from "lucide-react";
