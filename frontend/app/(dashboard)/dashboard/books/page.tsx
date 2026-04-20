import { BookMarked, Search, Filter } from "lucide-react";

export default function BooksPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Library</h1>
          <p className="page-subtitle">Manage and read your collection of books.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <div className="relative w-full sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
             <input type="text" placeholder="Search library..." className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm mb-4">
          <BookMarked size={28} className="text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Your library is empty</h3>
        <p className="text-zinc-500 text-sm mt-1 max-w-xs text-center">Start adding books from the explore tab or upload your own to begin reading.</p>
        <button className="btn-primary mt-6">Add Your First Book</button>
      </div>
    </div>
  );
}
