import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronUp, ChevronDown, Filter, Search, Settings, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function DataTable({ 
  data = [], 
  columns = [], 
  title = "Table", 
  searchPlaceholder = "Search",
  tableName 
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [10, 20, 50, 100];
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaultVisibility = columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {});
    const saved = localStorage.getItem(`table_vis_${tableName}`);
    if (saved) {
        return { ...defaultVisibility, ...JSON.parse(saved) };
    }
    return defaultVisibility;
  });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);

  useEffect(() => {
    if (tableName) {
      localStorage.setItem(`table_vis_${tableName}`, JSON.stringify(visibleColumns));
    }
  }, [visibleColumns, tableName]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(lowerTerm)));
    }
    Object.keys(filters).forEach(key => {
      if (filters[key]) result = result.filter(item => String(item[key]).toLowerCase().includes(filters[key].toLowerCase()));
    });
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, searchTerm, filters, sortConfig]);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
      
      {/* --- HEADER SECTION --- */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
            />
          </div>

          {/* Filter Button & Modal */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterModal(!showFilterModal)} 
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors 
                ${showFilterModal ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'} 
                text-gray-700 dark:text-gray-200`}
            >
              <Filter size={16} /> Filters
            </button>
            
            {showFilterModal && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 z-20">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Filter Columns</h3>
                  <button onClick={() => setFilters({})} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Clear all</button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {columns.filter(col => col.filterable).map(col => (
                    <div key={col.key}>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{col.label}</label>
                      <input 
                        type="text" 
                        value={filters[col.key] || ''} 
                        onChange={e => setFilters({...filters, [col.key]: e.target.value})} 
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md text-sm outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500" 
                        placeholder={`Filter ${col.label}...`} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columns Button & Modal */}
          <div className="relative">
            <button 
              onClick={() => setShowColumnModal(!showColumnModal)} 
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors
                ${showColumnModal ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'} 
                text-gray-700 dark:text-gray-200`}
            >
              <Settings size={16} /> Columns
            </button>
            {showColumnModal && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 z-20">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Visible Columns</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {columns.map(col => (
                    <label key={col.key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded transition-colors">
                      <input 
                        type="checkbox" 
                        checked={visibleColumns[col.key]} 
                        onChange={() => setVisibleColumns({...visibleColumns, [col.key]: !visibleColumns[col.key]})} 
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700" 
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              {columns.map(col => visibleColumns[col.key] && (
                <th 
                  key={col.key} 
                  className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors" 
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.sortable && (
                      <span className="text-gray-300 dark:text-gray-500">
                        {sortConfig.key === col.key && sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </span>
                    )}
                    {col.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors duration-150">
                  {columns.map(col => visibleColumns[col.key] && (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION SECTION --- */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select 
            value={pageSize} 
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} 
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 transition-colors"
          >
            {pageSizeOptions.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
          <span className="ml-2 hidden sm:inline">
            Showing {Math.min((currentPage - 1) * pageSize + 1, processedData.length)} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1} 
            className="p-1 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages || totalPages === 0} 
            className="p-1 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}