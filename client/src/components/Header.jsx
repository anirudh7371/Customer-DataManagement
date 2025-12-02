import React from 'react';
import { Plus } from 'lucide-react';

export default function Header({ onAddCustomer }) {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <button 
            onClick={onAddCustomer}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Add Customer
          </button>
        </div>
      </div>
    </div>
  );
}