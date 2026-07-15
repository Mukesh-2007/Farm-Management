import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const DataTable = ({
  columns,
  data = [],
  searchPlaceholder = "Search records...",
  searchKeys = [],
  pageSize = 5,
  actions = null,
  customFilters = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchTerm && searchKeys.length > 0) {
      result = result.filter(item => {
        return searchKeys.some(key => {
          const val = item[key];
          if (!val) return false;
          return String(val).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === undefined || bVal === undefined) return 0;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, sortConfig]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(processedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  return (
    <div className="glass-card rounded-2xl border border-slate-150/70 subtle-shadow overflow-hidden transition-all duration-300">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/45">
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-farm-500/20 focus:border-farm-500 hover:border-slate-350 transition-all placeholder-slate-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {customFilters}
          {actions}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-slate-600 text-xs">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-6 py-4 font-bold text-slate-450 text-[10px] tracking-widest uppercase select-none ${
                    col.sortable ? 'cursor-pointer hover:bg-slate-100/50 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-farm-600" /> : <ChevronDown className="w-3.5 h-3.5 text-farm-600" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/70 text-slate-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIdx) => (
                <tr key={item.id || rowIdx} className="hover:bg-slate-50/30 transition-all duration-150">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap align-middle font-medium">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 font-medium">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-4.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
          <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">
            Showing {Math.min((currentPage - 1) * pageSize + 1, processedData.length)} to{' '}
            {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} records
          </span>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-xl text-slate-650 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus:outline-none cursor-pointer flex items-center justify-center shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 focus:outline-none cursor-pointer ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-farm-600 to-emerald-700 text-white shadow-sm shadow-farm-650/15'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-xl text-slate-650 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus:outline-none cursor-pointer flex items-center justify-center shadow-sm"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
