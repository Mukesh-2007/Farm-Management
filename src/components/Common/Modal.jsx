import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Frosted glass backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full relative z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-300 ease-out">
        
        {/* Header */}
        <div className="px-6.5 py-5 border-b border-slate-100/80 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl text-slate-400 hover:text-slate-650 transition-all focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6.5 overflow-y-auto custom-scrollbar flex-grow text-xs text-slate-650 leading-relaxed space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6.5 py-4 border-t border-slate-100/85 bg-slate-50/50 rounded-b-3xl flex items-center justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
