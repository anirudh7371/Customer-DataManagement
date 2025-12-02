// src/CustomerDashboard.jsx  (or overwrite src/App.jsx / src/CustomerDashboard.jsx as appropriate)
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

const api = {
  async getCustomers() {
    // Simulating API call
    return [
      {
        id: 1,
        name: "Acme Corporation",
        email: "contact@acme.com",
        status: "Active",
        plan: "Enterprise",
        mrr: 5000,
        users: [
          { id: 1, name: "John Doe", email: "john@acme.com", role: "Admin", status: "Active" },
          { id: 2, name: "Jane Smith", email: "jane@acme.com", role: "User", status: "Active" },
          { id: 3, name: "Bob Wilson", email: "bob@acme.com", role: "User", status: "Inactive" }
        ]
      },
      {
        id: 2,
        name: "TechStart Inc",
        email: "hello@techstart.io",
        status: "Active",
        plan: "Professional",
        mrr: 2500,
        users: [
          { id: 4, name: "Alice Johnson", email: "alice@techstart.io", role: "Admin", status: "Active" },
          { id: 5, name: "Charlie Brown", email: "charlie@techstart.io", role: "User", status: "Active" }
        ]
      },
      {
        id: 3,
        name: "Global Systems",
        email: "info@globalsys.com",
        status: "Inactive",
        plan: "Basic",
        mrr: 1000,
        users: [
          { id: 6, name: "David Lee", email: "david@globalsys.com", role: "Admin", status: "Inactive" }
        ]
      }
    ];
  }
};

export default function CustomerDashboard() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // <-- hoisted function declaration (fixes eslint error)
  async function loadCustomers() {
    setLoading(true);
    const data = await api.getCustomers();
    setCustomers(data);
    setLoading(false);
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      loadCustomers();
    });
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === "Active").length,
    totalMRR: customers.reduce((sum, c) => sum + c.mrr, 0),
    totalUsers: customers.reduce((sum, c) => sum + c.users.length, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus size={20} />
            Add Customer
          </button>
        </div>
      </Header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard icon={Building2} label="Total Customers" value={stats.totalCustomers} color="#3b82f6" />
          <StatsCard icon={Activity} label="Active Customers" value={stats.activeCustomers} color="#10b981" />
          <StatsCard icon={DollarSign} label="Total MRR" value={`$${stats.totalMRR.toLocaleString()}`} color="#f59e0b" />
          <StatsCard icon={Users} label="Total Users" value={stats.totalUsers} color="#8b5cf6" />
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
                onSelect={setSelectedCustomer}
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
                <UserTable users={selectedCustomer.users} />
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
    </div>
  );
}
