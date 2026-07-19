import React from 'react';

const Skeleton = ({ className, variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-slate-200 rounded';
  
  const variantClasses = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    circle: 'rounded-full h-12 w-12',
    avatar: 'rounded-full h-10 w-10',
    card: 'h-32 w-full',
    button: 'h-10 w-24 rounded-lg',
    input: 'h-10 w-full rounded-lg',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className || ''}`}
      role="presentation"
      aria-hidden="true"
    />
  );
};

export const StatCardSkeleton = () => (
  <div className="glass-card rounded-2xl border border-slate-150 p-6 flex items-start justify-between">
    <div className="space-y-3 flex-1">
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="title" className="w-1/2" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
    <div className="p-3.5 rounded-xl bg-slate-100">
      <Skeleton variant="circle" className="h-5.5 w-5.5" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, idx) => (
      <td key={idx} className="px-6 py-4">
        <Skeleton variant="text" />
      </td>
    ))}
  </tr>
);

export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="glass-card rounded-2xl border border-slate-150/70 subtle-shadow overflow-hidden">
    <div className="p-5 border-b border-slate-100">
      <Skeleton variant="input" className="w-full md:max-w-xs" />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/70 border-b border-slate-100">
            {Array.from({ length: columns }).map((_, idx) => (
              <th key={idx} className="px-6 py-4">
                <Skeleton variant="text" className="w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/70">
          {Array.from({ length: rows }).map((_, idx) => (
            <TableRowSkeleton key={idx} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Skeleton;
