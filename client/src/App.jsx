import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { Plus, ArrowLeft, Sun, Moon } from "lucide-react";
import CustomerList from "./components/CustomerList";
import CustomerDetail from "./components/CustomerDetail";
import AddCustomerModal from "./components/AddCustomer";
import AddUserModal from "./components/AddUser";
import { getCustomers, getCustomerById, deleteCustomer, deleteUser } from "./services/api";

function CustomerView() {
  const navigate = useNavigate();
  const params = useParams();

  // --- Theme Logic ---
  const [theme, setTheme] = useState(() => {
    // 1. Check local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // 2. If no storage, check OS system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Data States ---
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Customer Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // User Modal States
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Stable loader
  const loadCustomers = useCallback(async () => {
    try {
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  }, []);

  // Stable details fetcher (also navigates)
  const handleViewDetails = useCallback(async (id) => {
    if (!id) return;
    try {
      const fullCustomerData = await getCustomerById(id);
      setSelectedCustomer(fullCustomerData);
      navigate(`/customers/${id}`, { replace: false });
    } catch (err) {
      console.error("Failed to load customer:", err);
    }
  }, [navigate]);

  // Load customers on mount
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // React to URL param changes
  useEffect(() => {
    if (params?.id) {
      handleViewDetails(params.id);
    } else {
      setSelectedCustomer(null);
    }
  }, [params?.id, handleViewDetails]);

  // --- Customer Actions ---
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
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
    await loadCustomers();
    if (selectedCustomer && editingCustomer?.id === selectedCustomer.id) {
      await handleViewDetails(selectedCustomer.id);
    }
    setShowAddModal(false);
    setEditingCustomer(null);
  }

  // --- User Actions ---
  async function handleDeleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
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
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">CustomerData</h1>
          </div>

          {/* Right Side Actions Group */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setEditingCustomer(null); setShowAddModal(true); }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium text-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Customer</span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors border border-transparent dark:border-gray-600 "
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-700" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
        {selectedCustomer ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => { setSelectedCustomer(null); navigate('/'); }}
              className="flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-6 transition-colors font-medium text-sm group"
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Routes>
        <Route path="/" element={<CustomerView />} />
        <Route path="/customers/:id" element={<CustomerView />} />
      </Routes>
    </div>
  );
}