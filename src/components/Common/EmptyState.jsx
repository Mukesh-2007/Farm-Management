import React from 'react';
import { Plus, Search, FileText, Sprout, Syringe, Database, HeartPulse, ShieldCheck, Users, FileSpreadsheet, Settings } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction,
  variant = 'default' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'animals':
        return {
          icon: Sprout,
          iconBg: 'bg-farm-100 text-farm-600',
          actionBg: 'bg-farm-600 hover:bg-farm-700'
        };
      case 'vaccinations':
        return {
          icon: Syringe,
          iconBg: 'bg-blue-100 text-blue-600',
          actionBg: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'feed':
        return {
          icon: Database,
          iconBg: 'bg-amber-100 text-amber-600',
          actionBg: 'bg-amber-600 hover:bg-amber-700'
        };
      case 'medicine':
        return {
          icon: HeartPulse,
          iconBg: 'bg-rose-100 text-rose-600',
          actionBg: 'bg-rose-600 hover:bg-rose-700'
        };
      case 'biosecurity':
        return {
          icon: ShieldCheck,
          iconBg: 'bg-purple-100 text-purple-600',
          actionBg: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'workers':
        return {
          icon: Users,
          iconBg: 'bg-indigo-100 text-indigo-600',
          actionBg: 'bg-indigo-600 hover:bg-indigo-700'
        };
      case 'reports':
        return {
          icon: FileSpreadsheet,
          iconBg: 'bg-teal-100 text-teal-600',
          actionBg: 'bg-teal-600 hover:bg-teal-700'
        };
      case 'settings':
        return {
          icon: Settings,
          iconBg: 'bg-slate-100 text-slate-600',
          actionBg: 'bg-slate-600 hover:bg-slate-700'
        };
      default:
        return {
          icon: Icon || FileText,
          iconBg: 'bg-slate-100 text-slate-500',
          actionBg: 'bg-farm-600 hover:bg-farm-700'
        };
    }
  };

  const styles = getVariantStyles();
  const DisplayIcon = styles.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className={`p-6 rounded-2xl ${styles.iconBg} mb-6`}>
        <DisplayIcon className="w-12 h-12" />
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className={`px-6 py-3 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-farm-500 ${styles.actionBg}`}
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export const EmptySearchState = ({ searchTerm, onClear }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="p-6 rounded-2xl bg-slate-100 text-slate-400 mb-6">
      <Search className="w-12 h-12" />
    </div>
    
    <h3 className="text-lg font-bold text-slate-800 mb-2">No results found</h3>
    <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
      We couldn't find any records matching <span className="font-semibold text-slate-700">"{searchTerm}"</span>
    </p>
    
    {onClear && (
      <button
        onClick={onClear}
        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
      >
        Clear search
      </button>
    )}
  </div>
);

export default EmptyState;
