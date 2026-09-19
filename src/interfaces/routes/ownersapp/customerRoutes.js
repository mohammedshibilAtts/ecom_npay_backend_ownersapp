import express from 'express';
import CustomerRepo from '../../../infrastructure/repositories/ownersapp/customerRepo.js';
import CustomerUseCase from '../../../usecases/ownersapp/customerUseCase.js';
import CustomerController from '../../controllers/ownersapp/customerController.js';

const customerRepo = new CustomerRepo();
const customerUseCase = new CustomerUseCase(customerRepo);
const customerController = new CustomerController(customerUseCase);

const router = express.Router();

router.get('/customers', customerController.getCustomers);
router.post('/customers', customerController.setCustomers);
router.get('/customers/find', customerController.findCustomer);
router.get('/customers/branch/:branchId/search', customerController.searchCustomerByMobileAndBranch);
router.post('/customers/table', customerController.customerTable);
export default router;
