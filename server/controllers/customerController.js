import Customer from '../models/Customer.js';
import User from '../models/User.js'; // Import User model

export async function getAllCustomers(req, res) {
  const customers = await Customer.findAll();
  res.json(customers);
}

export async function getCustomerById(req, res) {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  // Fetch users associated with this customer
  const users = await User.findByCustomerId(id);
  
  // Return customer data combined with users
  res.json({ ...customer, users });
}

export async function createCustomer(req, res) {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
}

export async function updateCustomer(req, res) {
  const { id } = req.params;
  const customer = await Customer.update(id, req.body);
  
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  res.json(customer);
}

export async function deleteCustomer(req, res) {
  const { id } = req.params;
  const customer = await Customer.delete(id);
  
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  res.json({ message: 'Customer deleted successfully' });
}