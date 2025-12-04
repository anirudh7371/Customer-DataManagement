import { useState, useCallback, useEffect } from 'react';
import { getCustomers, getCustomerById, deleteCustomer } from '../services/api';
import { useToast } from '../context/ToastContext';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadCustomers = useCallback(async () => {
    try {
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadCustomerDetails = useCallback(async (id) => {
    if (!id) {
      setSelectedCustomer(null);
      return;
    }
    try {
      const data = await getCustomerById(id);
      setSelectedCustomer(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customer details");
    }
  }, [toast]);

  const removeCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      toast.success("Customer deleted successfully");
      
      setCustomers(prev => prev.filter(c => c.id !== id));
      
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete customer");
      return false;
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    selectedCustomer,
    loading,
    loadCustomers,
    loadCustomerDetails,
    removeCustomer,
    setSelectedCustomer
  };
}