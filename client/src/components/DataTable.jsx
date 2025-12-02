import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronUp, ChevronDown, Filter, Eye, EyeOff, 
  ChevronLeft, ChevronRight, Settings, Search, X 
} from 'lucide-react';

export default function DataTable({ 
  data = [], 
  columns = [], 
  title = "Table", 
  searchPlaceholder = "Search",
  tableName 
}) {
  // States 
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [10, 20, 50, 100];
    // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem(`table_vis_${tableName}`);
    if (saved) return JSON.parse(saved);
    return columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {});
  });

  // UI Toggles
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);

  // --- Effects ---
  useEffect(() => {
    if (tableName) {
      localStorage.setItem(`table_vis_${tableName}`, JSON.stringify(visibleColumns));
    }
  }, [visibleColumns, tableName]);

  // --- Logic ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let result = [...data];

    // Global Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(lowerTerm)
        )
      );
    }

    // Column Filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        const lowerFilter = filters[key].toLowerCase();
        result = result.filter(item => 
          String(item[key]).toLowerCase().includes(lowerFilter)
        );
      }
    });

    // Sorting
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

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize, 
    currentPage * pageSize
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
      {/* --- Toolbar --- */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64 transition-all"
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterModal(!showFilterModal)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${Object.keys(filters).some(k => filters[k]) ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <Filter size={16} /> Filters
            </button>
            
            {/* Filter Dropdown */}
            {showFilterModal && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">Filter Columns</h3>
                  <button onClick={() => setFilters({})} className="text-xs text-blue-600 hover:underline">Clear all</button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {columns.filter(col => col.filterable).map(col => (
                    <div key={col.key}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{col.label}</label>
                      <input 
                        type="text"
                        value={filters[col.key] || ''}
                        onChange={e => setFilters({...filters, [col.key]: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder={`Filter ${col.label}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columns Visibility Button */}
          <div className="relative">
            <button 
              onClick={() => setShowColumnModal(!showColumnModal)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Settings size={16} /> Columns
            </button>

            {/* Visibility Dropdown */}
            {showColumnModal && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20">
                <h3 className="font-semibold text-gray-900 mb-3">Visible Columns</h3>
                <div className="space-y-2">
                  {columns.map(col => (
                    <label key={col.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input 
                        type="checkbox"
                        checked={visibleColumns[col.key]}
                        onChange={() => setVisibleColumns({...visibleColumns, [col.key]: !visibleColumns[col.key]})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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

      {/* --- Table --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {columns.map(col => visibleColumns[col.key] && (
                <th 
                  key={col.key}
                  className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none group"
                >
                  <div 
                    className={`flex items-center gap-2 ${col.sortable ? 'cursor-pointer hover:text-gray-700' : ''}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    {/* Arrow In Front */}
                    {col.sortable && (
                      <span className={`transition-colors ${sortConfig.key === col.key ? 'text-blue-600' : 'text-gray-300 group-hover:text-gray-400'}`}>
                        {sortConfig.key === col.key && sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </span>
                    )}
                    {col.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors duration-150">
                  {columns.map(col => visibleColumns[col.key] && (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                  No records found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination --- */}
      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select 
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="ml-2">
            Showing {Math.min((currentPage - 1) * pageSize + 1, processedData.length)} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
               let p = i + 1;
               if (totalPages > 5 && currentPage > 3) p = currentPage - 2 + i;
               if (p > totalPages) return null;
               
               return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                    currentPage === p 
                      ? 'bg-blue-600 text-white font-medium' 
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  {p}
                </button>
               )
            })}
          </div>

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}