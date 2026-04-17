import { createClient } from "@/lib/supabase/server";
import { Users, BookOpen, Activity, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  
  const [{ count: usersCount }, { count: booksCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("books").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Users", value: usersCount ?? 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Managed Books", value: booksCount ?? 0, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
    { label: "System Health", value: "98.2%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <ShieldCheck size={18} className="text-indigo-500" />
             <span className="text-xs font-bold text-indigo-500 tracking-widest uppercase">Security Level: Admin</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Management Hub</h1>
          <p className="text-zinc-500 mt-1 font-medium">Coordinate the Nexus Ai resources.</p>
        </div>
        <Link href="/admin/books/new" className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all text-center">
          Add New Material
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className={stat.bg + " w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"}>
                <Icon size={24} className={stat.color} />
              </div>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-4xl font-extrabold text-zinc-900 dark:text-white">{stat.value}</p>
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                  <ArrowUpRight size={10} /> 12%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-zinc-900 dark:bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 relative shadow-2xl overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
         <div className="relative">
            <h3 className="text-xl font-bold text-white mb-2">Quick Commands</h3>
            <p className="text-zinc-400 text-sm mb-6 max-w-md">Easily manage your book repository, update chapter contents, and track global user engagement metrics.</p>
            <div className="flex flex-wrap gap-3">
               <Link href="/admin/books" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">Manage Courses</Link>
               <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-all">Export Report</button>
            </div>
         </div>
      </div>
    </div>
  );
}
