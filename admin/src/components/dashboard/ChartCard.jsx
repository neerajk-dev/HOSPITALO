import React from 'react';

// Simple chart placeholder card for premium dashboards.
const ChartCard = ({ title, children, subtitle }) => {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
