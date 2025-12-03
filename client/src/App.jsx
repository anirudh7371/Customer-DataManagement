import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import CustomerList from "./components/CustomerList";
import CustomerDetail from "./components/CustomerDetail";
import AddCustomerModal from "./components/AddCustomer";
import AddUserModal from "./components/AddUser";
import { getCustomers, getCustomerById, deleteCustomer, deleteUser } from "./services/api";

function CustomerView() {
  const navigate = useNavigate();
  const params = useParams();

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Customer Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // User Modal States
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // stable loader
  const loadCustomers = useCallback(async () => {
    try {
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  }, []);

  // stable details fetcher (also navigates)
  const handleViewDetails = useCallback(async (id) => {
    if (!id) return;
    try {
      const fullCustomerData = await getCustomerById(id);
      setSelectedCustomer(fullCustomerData);
      // Push the route so URL matches selected view
      navigate(`/customers/${id}`, { replace: false });
    } catch (err) {
      console.error("Failed to load customer:", err);
    }
  }, [navigate]);

  // load customers once on mount (or when loadCustomers changes)
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // separate effect: react to URL param changes
  useEffect(() => {
    if (params?.id) {
      handleViewDetails(params.id);
    } else {
      // if URL has no id, clear selection (keeps UI + URL consistent)
      setSelectedCustomer(null);
    }
  }, [params?.id, handleViewDetails]);

  // --- Customer Actions ---
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      await loadCustomers();
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
        navigate('/');
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  function handleEdit(customer) {
    setEditingCustomer(customer);
    setShowAddModal(true);
  }

  async function handleModalSuccess() {
    // refresh list, then if the edited customer is visible, refresh its details
    await loadCustomers();
    if (selectedCustomer && editingCustomer?.id === selectedCustomer.id) {
      await handleViewDetails(selectedCustomer.id);
    }
    setShowAddModal(false);
    setEditingCustomer(null);
  }

  // --- User Actions ---
  async function handleDeleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      if (selectedCustomer) {
        await handleViewDetails(selectedCustomer.id);
      }
    } catch (err) {
      console.error("Delete user failed:", err);
    }
  }

  function handleEditUser(user) {
    setEditingUser(user);
    setShowUserModal(true);
  }

  function handleAddUser() {
    setEditingUser(null);
    setShowUserModal(true);
  }

  async function handleUserModalSuccess() {
    setShowUserModal(false);
    setEditingUser(null);
    if (selectedCustomer) {
      await handleViewDetails(selectedCustomer.id);
    }
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
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
              onClick={() => { setSelectedCustomer(null); navigate('/'); }}
              className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium text-sm group"
            >
              <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>

            <CustomerDetail
              customer={selectedCustomer}
              onEdit={handleEdit}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
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

      {/* Customer Modal */}
      {showAddModal && (
        <AddCustomerModal
          initialData={editingCustomer}
          onClose={() => { setShowAddModal(false); setEditingCustomer(null); }}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* User Modal */}
      {showUserModal && selectedCustomer && (
        <AddUserModal
          initialData={editingUser}
          customerId={selectedCustomer.id}
          onClose={() => { setShowUserModal(false); setEditingUser(null); }}
          onSuccess={handleUserModalSuccess}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
      <Routes>
        <Route path="/" element={<CustomerView />} />
        <Route path="/customers/:id" element={<CustomerView />} />
      </Routes>
    </div>
  );
}