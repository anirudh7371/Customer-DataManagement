import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getCustomers() {
  const response = await api.get('/customers');
  return response.data;
}

export async function getCustomerById(id) {
  const response = await api.get(`/customers/${id}`);
  return response.data;
}

export async function createCustomer(customerData) {
  const response = await api.post('/customers', customerData);
  return response.data;
}

export async function updateCustomer(id, customerData) {
  const response = await api.put(`/customers/${id}`, customerData);
  return response.data;
}

export async function deleteCustomer(id) {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
}

export async function getUsersByCustomerId(customerId) {
  const response = await api.get(`/customers/${customerId}/users`);
  return response.data;
}

export async function createUser(userData) {
  const response = await api.post('/users', userData);
  return response.data;
}

export async function deleteUser(id) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}