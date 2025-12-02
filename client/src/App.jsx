import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit2, Eye, ArrowLeft } from "lucide-react";
import Header from "./components/Header";
import UserTable from "./components/UserTable";
import AddCustomerModal from "./components/AddCustomer";
import { getCustomers, getCustomerById, deleteCustomer } from "./services/api";

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Contains full details + users
  const [searchTerm, setSearchTerm] = useState("");
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

  // Handle "View Details"
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

  // Handle Delete
  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomer(id);
      loadCustomers();
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
    }
  }

  // Handle Edit
  function handleEdit(customer) {
    setEditingCustomer(customer);
    setShowAddModal(true);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onAddCustomer={() => { setEditingCustomer(null); setShowAddModal(true); }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* If a customer is selected, show details view */}
        {selectedCustomer ? (
          <div>
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="flex items-center text-blue-600 mb-4 hover:underline"
            >
              <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCustomer.name}</h2>
              <div className="flex gap-6 text-sm text-gray-600">
                <p><strong>Country:</strong> {selectedCustomer.country}</p>
                <p><strong>Total Users:</strong> {selectedCustomer.user_count}</p>
              </div>
            </div>

            <UserTable users={selectedCustomer.users || []} />
          </div>
        ) : (
          /* Otherwise show the Dashboard Table */
          <>
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by Name or Country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">S.No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Country</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">User Count</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                  ) : filteredCustomers.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td 
                        className="px-6 py-4 text-sm font-medium text-blue-600 cursor-pointer hover:underline"
                        onClick={() => handleViewDetails(customer.id)}
                      >
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.country}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.user_count}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => handleViewDetails(customer.id)}
                            title="View Details"
                            className="text-blue-500 hover:text-blue-700 p-1 bg-blue-50 rounded"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleEdit(customer)}
                            title="Edit"
                            className="text-green-500 hover:text-green-700 p-1 bg-green-50 rounded"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(customer.id)}
                            title="Delete"
                            className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && !loading && (
                    <tr><td colSpan="5" className="p-6 text-center text-gray-500">No customers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showAddModal && (
        <AddCustomerModal
          initialData={editingCustomer}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadCustomers();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}