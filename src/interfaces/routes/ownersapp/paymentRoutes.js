import express from 'express';
import PaymentController from '../../controllers/ownersapp/paymentController.js';
import PaymentRepo from '../../../infrastructure/repositories/ownersapp/paymentRepo.js';
import PaymentUseCase from '../../../usecases/ownersapp/paymentUseCase.js';

import ActualPaymentUseCase from '../../../usecases/auth/chit/client/paymentUseCase.js';
import PaymentRepository from '../../../infrastructure/repositories/chit/paymentRepository.js';
import MetalRateRepository from '../../../infrastructure/repositories/chit/metalRateRepository.js';
import SchemeRepository from '../../../infrastructure/repositories/chit/schemeRepository.js';
import SchemeAccountRepository from '../../../infrastructure/repositories/chit/schemeAccountRepository.js';
import CustomerRewardRepository from '../../../infrastructure/repositories/chit/customerRewardRepository.js';
import TransactionDetailsRepository from '../../../infrastructure/repositories/chit/transactionDetailsRepository.js';
import TransactionRepository from '../../../infrastructure/repositories/chit/transactionRepository.js';
import SmsSettingRepository from '../../../infrastructure/repositories/chit/super/smsSettingRepository.js';
import TopupRepository from '../../../infrastructure/repositories/chit/topupRepository.js';
import PaymentOrderRepository from '../../../infrastructure/repositories/chit/paymentOrderRepository.js';
import CustomerRepository from '../../../infrastructure/repositories/chit/CustomerRepository.js';
import PaymentModeRepository from '../../../infrastructure/repositories/chit/PaymentModeRepository.js';
import EmployeeRepository from '../../../infrastructure/repositories/chit/EmployeeRepository.js';
import WalletRepository from '../../../infrastructure/repositories/chit/walletRepository.js';
import NotificationConfigRepository from '../../../infrastructure/repositories/chit/notificationConfigRepository.js';

const router = express.Router();

const paymentRepository = new PaymentRepository();
const customerRepo = new CustomerRepository();
const metalrateRepository = new MetalRateRepository();
const schemeRepository = new SchemeRepository();
const schemeAccountRepository = new SchemeAccountRepository();
const customerRewardRepository = new CustomerRewardRepository();
const transactionDetailsRepository = new TransactionDetailsRepository();
const transactionRepository = new TransactionRepository();
const smsRepo = new SmsSettingRepository();
const topupRepo = new TopupRepository();
const paymentOrderRepo = new PaymentOrderRepository();
const paymentModeRepo = new PaymentModeRepository();
const walletRepo = new WalletRepository();
const emplyeeRepo = new EmployeeRepository();
const notificationconfig = new NotificationConfigRepository();

const actualPaymentUseCase = new ActualPaymentUseCase(
    paymentRepository,
    metalrateRepository,
    schemeRepository,
    schemeAccountRepository,
    customerRewardRepository,
    transactionDetailsRepository,
    transactionRepository,
    smsRepo,
    topupRepo,
    paymentOrderRepo,
    customerRepo,
    paymentModeRepo,
    emplyeeRepo,
    walletRepo,
    notificationconfig
);

const paymentRepo = new PaymentRepo();
const paymentUseCase = new PaymentUseCase(paymentRepo, actualPaymentUseCase);
const paymentController = new PaymentController(paymentUseCase);

router.get('/payments', (req, res) => paymentController.getPayments(req, res));
router.post('/payment', (req, res) => paymentController.addPayment(req, res));
router.get('/payment/schacc/web', (req, res) => paymentController.getPaymentBySchemeAccountWeb(req, res));

export default router;
