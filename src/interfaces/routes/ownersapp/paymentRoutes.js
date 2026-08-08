import express from 'express';
import PaymentController from '../../controllers/ownersapp/paymentController.js';
import PaymentRepo from '../../../infrastructure/repositories/ownersapp/paymentRepo.js';
import PaymentUseCase from '../../../usecases/ownersapp/paymentUseCase.js';

const router = express.Router();

const paymentRepo = new PaymentRepo();
const paymentUseCase = new PaymentUseCase(paymentRepo);
const paymentController = new PaymentController(paymentUseCase);

router.get('/payments', (req, res) => paymentController.getPayments(req, res));

export default router;
