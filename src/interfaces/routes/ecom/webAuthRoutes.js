import express from 'express';
import WebAuthController from '../../controllers/ecom/webAuthController.js';
import WebAuthUsecase from '../../../usecases/ecom/webAuthUsecase.js';
import CustomerRepository from '../../../infrastructure/repositories/chit/CustomerRepository.js';

const router = express.Router();

const customerRepository = new CustomerRepository();
const usecase = new WebAuthUsecase(customerRepository);
const controller = new WebAuthController(usecase);

router.post('/signup', (req, res) => controller.signup(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));
router.get('/me', (req, res) => controller.authMe(req, res));
router.post('/add-profile', (req, res) => controller.addProfile(req, res));
router.patch('/update-profile', (req, res) => controller.updateProfile(req, res));

export default router;
