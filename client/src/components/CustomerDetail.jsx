import React from 'react';
import { UserPlus, MapPin, Calendar, Edit, ArrowLeft } from 'lucide-react';
import UserTable from './UserTable';

export default function CustomerDetail({ 
  customer, 
  onEdit, 
  onAddUser, 
  onEditUser, 
  onDeleteUser 
}) {
  if (!customer) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Customer Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                Customer #{customer.id}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-gray-400 dark:text-gray-500" />
                {customer.country}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                Joined {new Date(customer.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <button
            onClick={() => onEdit(customer)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit size={16} />
            Edit Details
          </button>
        </div>
      </div>

      {/* 2. Users Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Associated Users</h3>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2.5 rounded-full text-xs font-semibold">
              {customer.users ? customer.users.length : 0}
            </span>
          </div>
          
          <button
            onClick={onAddUser}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm"
          >
            <UserPlus size={16} />
            Add User
          </button>
        </div>

        {/* This displays the UserTable passing the users array */}
        <UserTable 
          users={customer.users || []} 
          onEdit={onEditUser}
          onDelete={onDeleteUser}
        />
      </div>
    </div>
  );
}