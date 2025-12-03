import Customer from '../models/Customer.js';
import User from '../models/User.js'; 

export async function getAllCustomers(req, res) {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;
  
  try {
    // 1. Fetch Customer
    const customer = await Customer.findById(id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    let users = [];
    try {
        users = await User.findByCustomerId(id);
    } catch (userError) {
        console.error(`Warning: Could not fetch users for customer ${id}:`, userError);
        users = []; // Default to empty array if this fails
    }
    
    // 3. Return combined data
    res.json({ ...customer, users });

  } catch (error) {
    console.error("Error in getCustomerById:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createCustomer(req, res) {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateCustomer(req, res) {
  const { id } = req.params;
  try {
    const customer = await Customer.update(id, req.body);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCustomer(req, res) {
  const { id } = req.params;
  try {
    const customer = await Customer.delete(id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}