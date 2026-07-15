import React from 'react';
import { AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

const AlertBanner = ({ type = 'warning', message, onClose, actionText, onAction }) => {
  const getStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-rose-50/70 border-l-4 border-l-rose-500 border-y-slate-100 border-r-slate-100 text-rose-900',
          icon: AlertOctagon,
          iconColor: 'text-rose-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50/70 border-l-4 border-l-blue-500 border-y-slate-100 border-r-slate-100 text-blue-900',
          icon: Info,
          iconColor: 'text-blue-500'
        };
      case 'warning':
      default:
        return {
          bg: 'bg-amber-50/70 border-l-4 border-l-amber-500 border-y-slate-100 border-r-slate-100 text-amber-900',
          icon: AlertTriangle,
          iconColor: 'text-amber-600'
        };
    }
  };

  const { bg, icon: Icon, iconColor } = getStyles();

  return (
    <div className={`p-4 border rounded-2xl flex items-start justify-between shadow-sm hover:shadow transition-all duration-300 glass-card ${bg}`}>
      <div className="flex items-start space-x-3.5">
        <div className="p-1 rounded-lg bg-white/65 shadow-sm mt-0.5">
          <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs font-bold leading-normal tracking-wide">{message}</p>
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="mt-2 text-[10px] font-extrabold uppercase tracking-widest text-farm-700 hover:text-farm-800 transition-colors block focus:outline-none underline hover:no-underline cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 hover:bg-white border border-transparent hover:border-slate-150 rounded-xl transition-all focus:outline-none cursor-pointer"
        >
          <X className="w-4 h-4 text-slate-400 hover:text-slate-650" />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
