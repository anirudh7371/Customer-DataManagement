import React from 'react';

export default function CustomerCard({ customer, onSelect, isSelected }) {
  const totalUsers = customer.users?.length || customer.user_count || 0;
  const activeUsers = customer.users 
    ? customer.users.filter(u => u.status === 'Active').length 
    : customer.active_user_count || 0;

  return (
    <div
      onClick={() => onSelect(customer)}
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{customer.email}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          customer.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {customer.status}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        <div>
          <p className="text-xs text-gray-500">Plan</p>
          <p className="text-sm font-semibold mt-1">{customer.plan}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">MRR</p>
          <p className="text-sm font-semibold mt-1">${customer.mrr}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Users</p>
          <p className="text-sm font-semibold mt-1">{activeUsers}/{totalUsers}</p>
        </div>
      </div>
    </div>
  );
}
