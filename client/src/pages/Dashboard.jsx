import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCustomers } from "../hooks/useCustomers";
import { deleteUser } from "../services/api";
import { useToast } from "../context/ToastContext";

// Components
import CustomerList from "../components/CustomerList";
import CustomerDetail from "../components/CustomerDetail";
import AddCustomerModal from "../components/AddCustomer";
import AddUserModal from "../components/AddUser";
import Layout from "../components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();
  const params = useParams();
  const toast = useToast();
  
  // Custom Hook for Data Logic
  const { 
    customers, 
    selectedCustomer, 
    loading, 
    loadCustomers, 
    loadCustomerDetails, 
    removeCustomer,
    setSelectedCustomer 
  } = useCustomers();

  // Local UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Sync URL with State
  useEffect(() => {
    if (params.id) {
      loadCustomerDetails(params.id);
    } else {
      setSelectedCustomer(null);
    }
  }, [params.id, loadCustomerDetails, setSelectedCustomer]);

  // --- Handlers ---

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleViewDetails = (id) => {
    navigate(`/customers/${id}`);
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    const success = await removeCustomer(id);
    if (success) handleNavigateHome();
  };

  const handleModalSuccess = async () => {
    await loadCustomers();
    if (selectedCustomer) {
      await loadCustomerDetails(selectedCustomer.id);
    }
    setShowAddModal(false);
    setEditingCustomer(null);
    toast.success(editingCustomer ? "Customer updated!" : "Customer created!");
  };

  // User Handlers
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      toast.success("User deleted");
      // Reload details to refresh the user list
      if (selectedCustomer) loadCustomerDetails(selectedCustomer.id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const handleUserSuccess = async () => {
    setShowUserModal(false);
    setEditingUser(null);
    if (selectedCustomer) {
        await loadCustomerDetails(selectedCustomer.id);
    }
    toast.success(editingUser ? "User updated!" : "User added!");
  };

  return (
    <Layout onAddCustomer={() => { setEditingCustomer(null); setShowAddModal(true); }}>
      
      {/* Loading Skeleton or Content */}
      {loading && customers.length === 0 ? (
        <div className="flex justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {selectedCustomer ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <button
                onClick={handleNavigateHome}
                className="flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-6 transition-colors font-medium text-sm group"
              >
                <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>

              <CustomerDetail
                customer={selectedCustomer}
                onEdit={(c) => { setEditingCustomer(c); setShowAddModal(true); }}
                onAddUser={() => { setEditingUser(null); setShowUserModal(true); }}
                onEditUser={(u) => { setEditingUser(u); setShowUserModal(true); }}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <CustomerList
                customers={customers}
                onViewDetails={handleViewDetails}
                onEdit={(c) => { setEditingCustomer(c); setShowAddModal(true); }}
                onDelete={handleDeleteCustomer}
              />
            </div>
          )}
        </>
      )}

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
          onSuccess={handleUserSuccess}
        />
      )}
    </Layout>
  );
}