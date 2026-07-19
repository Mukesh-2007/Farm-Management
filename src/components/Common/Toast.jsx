import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.autoClose !== false) {
      const timer = setTimeout(() => {
        onClose();
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error':
        return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconBg = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-rose-500';
      case 'warning':
        return 'bg-amber-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm animate-in slide-in-from-right-full duration-300 ${getStyles()}`}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className={`p-1.5 rounded-lg ${getIconBg()} text-white flex-shrink-0`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-bold text-sm leading-tight">{toast.title}</p>
        )}
        <p className="text-sm mt-1 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-black/20"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
