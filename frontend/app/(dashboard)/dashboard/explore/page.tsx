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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-2xl text-white relative overflow-hidden">
          <div className="relative z-10 w-2/3">
             <h2 className="text-2xl font-bold mb-2">Curated for you</h2>
             <p className="text-indigo-100 mb-6">Our AI has analyzed your reading patterns to find books you'll love.</p>
             <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors">Start Discovery</button>
          </div>
          <Sparkles className="absolute -right-4 -bottom-4 w-48 h-48 text-white/10" />
        </div>

        <section className="col-span-full">
           <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Popular Categories</h3>
           <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm font-medium hover:border-indigo-500 transition-colors">
                  {cat}
                </button>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
