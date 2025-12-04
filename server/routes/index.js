import express from 'express';
import { 
    getAllCustomers, 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer 
} from '../controllers/customerController.js';

import { 
    getUsersByCustomerId,
    createUser, 
    updateUser, 
    deleteUser 
} from '../controllers/userController.js';

const router = express.Router();

// --- Customer Routes ---
router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

// --- User Routes ---
router.get('/customers/:id/users', getUsersByCustomerId);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;