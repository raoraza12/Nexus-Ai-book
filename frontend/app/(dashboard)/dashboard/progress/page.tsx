import { BarChart2, TrendingUp, Calendar, Target } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reading Progress</h1>
          <p className="page-subtitle">Track your learning goals and achievements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                 <Target className="text-emerald-600" size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Monthly Goal</h3>
                 <p className="text-sm text-zinc-500">4 books per month</p>
              </div>
           </div>
           
           <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                 <span className="text-zinc-500">Progress</span>
                 <span className="text-zinc-900 dark:text-white">75%</span>
              </div>
              <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full w-[75%]" />
              </div>
              <p className="text-xs text-zinc-400">3 of 4 books completed this month. Keep it up!</p>
           </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                 <TrendingUp className="text-indigo-600" size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Reading Velocity</h3>
                 <p className="text-sm text-zinc-500">Pages per hour</p>
              </div>
           </div>
           
           <div className="flex items-end gap-2 h-20">
              {[40, 60, 45, 90, 65, 80, 55].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-sm relative group hover:bg-indigo-500/40 transition-colors">
                   <div style={{ height: `${h}%` }} className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-sm" />
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-2 text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </div>
      </div>
    </div>
  );
}
