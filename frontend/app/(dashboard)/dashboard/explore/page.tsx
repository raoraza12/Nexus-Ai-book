import { Layers, Sparkles, FireExtinguisher as Fire, TrendingUp } from "lucide-react";

const CATEGORIES = ["Artificial Intelligence", "Programming", "Self Improvement", "History", "Science", "Business"];

export default function ExplorePage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore</h1>
          <p className="page-subtitle">Discover your next great read with AI recommendations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="col-span-full bg-gradient-to-br from-indigo-600 to-violet-700 p-6 sm:p-10 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="relative z-10 w-full sm:w-2/3">
             <h2 className="text-2xl sm:text-4xl font-black mb-3 italic tracking-tighter uppercase">Curated for you</h2>
             <p className="text-indigo-100 mb-8 font-medium italic sm:text-lg">Our AI has analyzed your reading patterns to find books you'll love.</p>
             <button className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all uppercase tracking-widest shadow-xl shadow-black/10">Start Discovery</button>
          </div>
          <Sparkles className="absolute -right-8 -bottom-8 w-48 h-48 sm:w-64 sm:h-64 text-white/10 rotate-12" />
        </div>

        <section className="col-span-full pt-4">
           <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-6 italic">Popular Categories</h3>
           <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(cat => (
                <button key={cat} className="px-5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all">
                  {cat}
                </button>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
