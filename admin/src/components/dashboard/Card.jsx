import React from 'react';

// Reusable card wrapper with soft shadows and rounded corners.
const Card = ({ children, className = '', padding = 'p-5' }) => {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80 ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
