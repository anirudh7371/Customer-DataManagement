import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  DollarSign,
  Activity,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import StatsCard from "./components/StatsCard";
import CustomerCard from "./components/CustomerCard";
import Header from "./components/Header";
import UserTable from "./components/UserTable";
import AddCustomerModal from "./components/AddCustomerModal";
import { getCustomers, getCustomerById, getStats } from "./services/api";

export default function CustomerDashboard() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_customers: 0,
    active_customers: 0,
    total_mrr: 0,
    total_users: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);

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

  async function loadStats() {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function handleCustomerSelect(customer) {
    try {
      const fullCustomer = await getCustomerById(customer.id);
      setSelectedCustomer(fullCustomer);
    } catch (error) {
      console.error('Error loading customer details:', error);
    }
  }

  useEffect(() => {
    loadCustomers();
    loadStats();
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            icon={Building2} 
            label="Total Customers" 
            value={stats.total_customers} 
            color="#3b82f6" 
          />
          <StatsCard 
            icon={Activity} 
            label="Active Customers" 
            value={stats.active_customers} 
            color="#10b981" 
          />
          <StatsCard 
            icon={DollarSign} 
            label="Total MRR" 
            value={`$${parseFloat(stats.total_mrr || 0).toLocaleString()}`} 
            color="#f59e0b" 
          />
          <StatsCard 
            icon={Users} 
            label="Total Users" 
            value={stats.total_users} 
            color="#8b5cf6" 
          />
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
              <Filter size={20} />
              Filter
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customers List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
            {filteredCustomers.map(customer => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onSelect={handleCustomerSelect}
                isSelected={selectedCustomer?.id === customer.id}
              />
            ))}
          </div>

          {/* Selected Customer Details */}
          <div>
            {selectedCustomer ? (
              <div className="space-y-6 sticky top-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {selectedCustomer.name}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">{selectedCustomer.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        selectedCustomer.status === "Active" ? "text-green-600" : "text-red-600"
                      }`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MRR:</span>
                      <span className="font-medium">${selectedCustomer.mrr}</span>
                    </div>
                  </div>
                </div>
                <UserTable users={selectedCustomer.users || []} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Select a customer to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadCustomers();
            loadStats();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}