import React from 'react';
import { CalendarDays } from 'lucide-react';

// Beautiful calendar widget with highlighted current day.
const CalendarWidget = () => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Calendar</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Today’s appointments</p>
        </div>
        <div className="rounded-2xl bg-blue-500/10 p-2 text-blue-600">
          <CalendarDays className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-400">
        {days.map((day, index) => (
          <div key={`${day}-${index}`}>{day}</div>
        ))}
        {dates.map((date) => {
          const isToday = date === 18;
          const hasAppointment = [4, 8, 11, 18, 24].includes(date);
          return (
            <div key={date} className="flex items-center justify-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${isToday ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : hasAppointment ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : 'text-slate-500'}`}>
                {date}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;
