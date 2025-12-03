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

router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

// --- User Routes ---
router.get('/customers/:id/users', getUsersByCustomerId);
router.post('/customers/:id/users', createUser);
router.post('/customers/:id/users', createUser);
router.put('/customers/:customerId/users/:id', updateUser);
router.delete('/customers/:customerId/users/:id', deleteUser);

export default router;