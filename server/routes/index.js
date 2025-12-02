import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import {
  getAllUsers,
  getUsersByCustomerId,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();
// Customer routes
router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);
// User routes
router.get('/users', getAllUsers);
router.get('/customers/:customerId/users', getUsersByCustomerId);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;