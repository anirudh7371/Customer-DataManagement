import React, { useMemo } from 'react';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import DataTable from './DataTable';

export default function UserTable({ users = [], onEdit, onDelete }) {
  
  const columns = useMemo(() => [
    { 
      key: 'name', 
      label: 'Full Name', 
      sortable: true, 
      filterable: true, 
      render: (row) => <span className="font-medium text-gray-900 dark:text-gray-100">{row.name}</span> 
    },
    { 
      key: 'age', 
      label: 'Age', 
      sortable: true, 
      filterable: true 
    },
    { 
      key: 'role', 
      label: 'Role', 
      sortable: true, 
      filterable: true,
      render: (row) => (
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
          row.role === 'Admin' 
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200' 
            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {row.role}
        </span>
      )
    },
    { key: 'country', label: 'Country', sortable: true, filterable: true },
    { key: 'gender', label: 'Gender', sortable: true, filterable: true },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit && onEdit(row)}
            className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit2 size={18} />
          </button>
          
          <button 
            onClick={() => onDelete && onDelete(row.id)}
            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete User"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ], [onEdit, onDelete]);

  return (
    <DataTable 
      tableName="users"
      data={users}
      columns={columns}
      title="Users Data"
      searchPlaceholder="Search users..."
    />
  );
}