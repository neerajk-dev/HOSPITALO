import React from 'react';
import { Search, Bell, Settings, Moon, Sun, CalendarDays, ChevronDown } from 'lucide-react';

// Top header for admin and doctor dashboards with search and actions.
const Header = ({ title, subtitle, role = 'Admin', darkMode, setDarkMode }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/80 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">{role} Workspace</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <Search className="h-4 w-4" />
            <input className="w-full bg-transparent outline-none sm:w-48" placeholder="Search" />
          </label>

          <div className="flex items-center gap-2">
            <button className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <Bell className="h-4 w-4" />
            </button>
            <button className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <Settings className="h-4 w-4" />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-semibold text-white">A</div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Admin</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
