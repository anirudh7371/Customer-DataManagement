import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import UserTable from './UserTable';

export default function CustomerDetail({ customer, onEdit, onAddUser, onEditUser, onDeleteUser }) {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{customer.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {customer.country}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1.5">
                <Users size={16} />
                {customer.user_count || (customer.users ? customer.users.length : 0)} Users
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onAddUser}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus size={16} />
              Add User
            </button>
            <button 
              onClick={() => onEdit(customer)} 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <UserTable 
        users={customer.users || []} 
        onEdit={onEditUser}
        onDelete={onDeleteUser}
      />
    </>
  );
}