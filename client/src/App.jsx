import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft, Users } from "lucide-react";
import CustomerTable from "./components/CustomerTable";
import UserTable from "./components/UserTable";
import AddCustomerModal from "./components/AddCustomer";
import { getCustomers, getCustomerById, deleteCustomer } from "./services/api";

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  async function loadCustomers() {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  }

  // --- Handlers ---
  async function handleViewDetails(id) {
    try {
      setLoading(true);
      const fullCustomerData = await getCustomerById(id);
      setSelectedCustomer(fullCustomerData);
    } catch (error) {
      console.error("Error fetching details", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      await deleteCustomer(id);
      loadCustomers();
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
    }
  }

  function handleEdit(customer) {
    setEditingCustomer(customer);
    setShowAddModal(true);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <h1 className="text-xl font-bold text-gray-900">CustomerData</h1>
          </div>
          
          <button 
            onClick={() => { setEditingCustomer(null); setShowAddModal(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium text-sm"
          >
            <Plus size={18} />
            New Customer
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedCustomer ? (
          // Detail View
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium text-sm group"
            >
              <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
              Back to Dashboard
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {selectedCustomer.country}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1.5">
                      <Users size={16} />
                      {selectedCustomer.user_count || (selectedCustomer.users ? selectedCustomer.users.length : 0)} Users
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(selectedCustomer)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <UserTable users={selectedCustomer.users || []} />
          </div>
        ) : (
          // Main Dashboard
          <div className="animate-in fade-in duration-500">
            <CustomerTable 
              customers={customers}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddCustomerModal
          initialData={editingCustomer}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadCustomers();
            if (selectedCustomer && editingCustomer?.id === selectedCustomer.id) {
               // Refresh detail view if we edited the currently viewed customer
               handleViewDetails(selectedCustomer.id); 
            }
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}