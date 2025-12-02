import React, { useMemo } from 'react';
import DataTable from './DataTable';

export default function UserTable({ users }) {
  
  const columns = useMemo(() => [
    { key: 'name', label: 'Full Name', sortable: true, filterable: true, 
      render: (row) => <span className="font-medium text-gray-900">{row.name}</span> },
    { key: 'age', label: 'Age', sortable: true, filterable: true },
    { key: 'role', label: 'Role', sortable: true, filterable: true,
      render: (row) => (
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
          row.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {row.role}
        </span>
      )
    },
    { key: 'country', label: 'Country', sortable: true, filterable: true },
    { key: 'gender', label: 'Gender', sortable: true, filterable: true }
  ], []);

  return (
    <DataTable 
      tableName="users"
      data={users}
      columns={columns}
      title="Associated Users"
      searchPlaceholder="Search users..."
    />
  );
}