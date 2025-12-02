import Customer from '../models/Customer.js';

export const getAllCustomers = async (req, res) => {
  const customers = await Customer.findAll();
  res.json(customers);
};

export const getCustomerById = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
}

export const createCustomer = async (req, res) => {
  const customer = await Customer.create(req.body);
    res.status(201).json(customer);
};

export const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.update(id, req.body);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
    const customer = await Customer.delete(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
};