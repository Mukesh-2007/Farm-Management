import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, trend, trendType = 'neutral' }) => {
  const getTrendColor = () => {
    if (trendType === 'up') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (trendType === 'down') return 'bg-rose-50 text-rose-700 border-rose-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const getIconBg = () => {
    const t = title.toLowerCase();
    if (t.includes('sick') || t.includes('sickness') || t.includes('disease') || t.includes('alert')) {
      return 'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 border-rose-200/50';
    }
    if (t.includes('vaccine') || t.includes('vaccination') || t.includes('pending')) {
      return 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200/50';
    }
    if (t.includes('feed') || t.includes('stock') || t.includes('low')) {
      return 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 border-amber-200/50';
    }
    return 'bg-gradient-to-br from-farm-50 to-farm-100 text-farm-700 border-farm-200/50';
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-150 p-6 flex items-start justify-between hover-lift subtle-shadow transition-all duration-300 btn-press cursor-pointer">
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{title}</span>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</span>
          {trend && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTrendColor()}`}>
              {trend}
            </span>
          )}
        </div>
        {subtext && <span className="text-xxs text-slate-450 block font-medium">{subtext}</span>}
      </div>
      
      {Icon && (
        <div className={`p-3.5 rounded-xl border shadow-sm icon-bounce ${getIconBg()}`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
