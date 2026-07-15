import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyles = (state) => {
    const s = state?.toLowerCase() || '';
    if (s.includes('healthy') || s.includes('completed') || s.includes('present') || s.includes('recovered') || s.includes('checked out') || s.includes('optimal')) {
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-150',
        dot: 'bg-emerald-500'
      };
    }
    if (s.includes('due') || s.includes('low') || s.includes('scheduled') || s.includes('pending') || s.includes('leave') || s.includes('warning')) {
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-150',
        dot: 'bg-amber-500'
      };
    }
    if (s.includes('overdue') || s.includes('outbreak') || s.includes('isolated') || s.includes('sick') || s.includes('absent') || s.includes('high') || s.includes('expired')) {
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-150',
        dot: 'bg-rose-500 animate-pulse'
      };
    }
    if (s.includes('treatment') || s.includes('in progress') || s.includes('checked in') || s.includes('reported')) {
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-150',
        dot: 'bg-blue-500'
      };
    }
    return {
      badge: 'bg-slate-50 text-slate-700 border-slate-150',
      dot: 'bg-slate-450'
    };
  };

  const { badge, dot } = getStyles(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
