import React, { useMemo } from 'react';
import { Edit2, Eye, Trash2, Users } from 'lucide-react';
import DataTable from './DataTable';

export default function CustomerList({ customers, onViewDetails, onEdit, onDelete }) {
  const columns = useMemo(() => [
    { 
      key: 'id', 
      label: 'ID', 
      sortable: true, 
      filterable: true,
      render: (row) => <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">#{row.id}</span>
    },
    { 
      key: 'name', 
      label: 'Customer Name', 
      sortable: true, 
      filterable: true,
      render: (row) => (
        <button 
          onClick={() => onViewDetails(row.id)}
          className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline text-left"
        >
          {row.name}
        </button>
      )
    },
    { 
      key: 'country', 
      label: 'Country', 
      sortable: true, 
      filterable: true 
    },
    { 
      key: 'user_count', 
      label: 'Users', 
      sortable: true, 
      filterable: false,
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
          <Users size={12} className="mr-1" />
          {row.user_count}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onViewDetails(row.id)}
            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button 
            onClick={() => onEdit(row)}
            className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(row.id)}
            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ], [onViewDetails, onEdit, onDelete]);

  return (
    <DataTable 
      tableName="customers"
      data={customers}
      columns={columns}
      title="All Customers"
      searchPlaceholder="Search customers or countries..."
    />
  );
}