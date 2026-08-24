import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Stat card with animated counter look and stylish trend badge.
const StatCard = ({ title, value, icon: Icon, trend, trendType = 'up', accent = 'from-blue-500 to-cyan-500', iconBg = 'bg-blue-500/10 text-blue-600' }) => {
  return (
    <div className="group rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_45px_rgba(15,23,42,0.1)] dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${trendType === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
          {trendType === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          <span>{trend}</span>
        </div>
        <span className="text-slate-400">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;
