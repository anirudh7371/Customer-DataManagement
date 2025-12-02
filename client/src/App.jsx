import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import CustomerList from "./components/CustomerList";
import CustomerDetail from "./components/CustomerDetail";
import AddCustomerModal from "./components/AddCustomer";
import { getCustomers, getCustomerById, deleteCustomer } from "./services/api";

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const data = await getCustomers();
    setCustomers(data);
  }

  async function handleViewDetails(id) {
    const fullCustomerData = await getCustomerById(id);
    setSelectedCustomer(fullCustomerData);
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomer(id);
      loadCustomers();
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
    }
  }

  function handleEdit(customer) {
    setEditingCustomer(customer);
    setShowAddModal(true);
  }

  function handleModalSuccess() {
    loadCustomers();
    if (selectedCustomer && editingCustomer?.id === selectedCustomer.id) {
      handleViewDetails(selectedCustomer.id);
    }
    setShowAddModal(false);
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium text-sm group"
            >
              <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
              Back to Dashboard
            </button>

            <CustomerDetail 
              customer={selectedCustomer}
              onEdit={handleEdit}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <CustomerList 
              customers={customers}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>

      {showAddModal && (
        <AddCustomerModal
          initialData={editingCustomer}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}