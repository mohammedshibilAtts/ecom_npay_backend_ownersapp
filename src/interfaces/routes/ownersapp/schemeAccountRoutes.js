import express from 'express';
import SchemeAccountRepository from '../../../infrastructure/repositories/chit/schemeAccountRepository.js';
import CustomerRepository from '../../../infrastructure/repositories/chit/CustomerRepository.js';
import ActualSchemeAccountUseCase from '../../../usecases/auth/chit/client/schemeAccountUseCase.js';
import SchemeAccountController from '../../controllers/ownersapp/schemeAccountController.js';
import SchemeAccountRepo from '../../../infrastructure/repositories/ownersapp/schemeAccountRepo.js';
import SchemeAccountUseCase from '../../../usecases/ownersapp/schemeAccountUseCase.js';
import SchemeTypeRepo from '../../../infrastructure/repositories/chit/SchemeTypeRepository.js';
import MetalRepo from '../../../infrastructure/repositories/chit/MetalRepository.js';
import PaymentRepo from '../../../infrastructure/repositories/chit/paymentRepository.js';
import GiftIssuesRepo from '../../../infrastructure/repositories/chit/giftIssuesRepository.js';
import PurityRepo from '../../../infrastructure/repositories/chit/purityReporsitory.js';
import EmployeeRepository from '../../../infrastructure/repositories/chit/EmployeeRepository.js';
import SchemeRepository from '../../../infrastructure/repositories/chit/schemeRepository.js';
import ClosAccRepository from '../../../infrastructure/repositories/chit/closeAccountRepository.js';
import SmsSettingRepository from '../../../infrastructure/repositories/chit/super/smsSettingRepository.js';
import OtpRepository from '../../../infrastructure/repositories/chit/otpRepository.js';
import OtpUseCase from '../../../usecases/auth/chit/client/otpUseCase.js';
import SmsSender from '../../../utils/sendSms.js';
import TopupRepository from '../../../infrastructure/repositories/chit/topupRepository.js';

const router = express.Router();

const schemeAccountRepo = new SchemeAccountRepo();
const chitSchemeAccountRepo = new SchemeAccountRepository();
const customerRepo = new CustomerRepository();
const schemetypeRepo = new SchemeTypeRepo();
const metalRepo = new MetalRepo();
const paymentRepo = new PaymentRepo();
const giftIssueRepo = new GiftIssuesRepo();
const schemeRespo = new SchemeRepository();
const purityRepo = new PurityRepo();
const employeeRepository = new EmployeeRepository();
const closeAccRepo = new ClosAccRepository();
const smsRepo = new SmsSettingRepository();
const otpRepo = new OtpRepository();
const smsSender = new SmsSender();
const topupRepo = new TopupRepository();

const actualSchemeAccountUseCase = new ActualSchemeAccountUseCase(
    chitSchemeAccountRepo,
    employeeRepository,
    schemeRespo,
    closeAccRepo,
    customerRepo,
    schemetypeRepo,
    metalRepo,
    paymentRepo,
    giftIssueRepo,
    purityRepo,
    smsRepo,
    otpRepo,
    smsSender,
    topupRepo
);

const otpUseCase = new OtpUseCase(otpRepo);

const schemeAccountUseCase = new SchemeAccountUseCase(schemeAccountRepo, actualSchemeAccountUseCase, otpUseCase);
const schemeAccountController = new SchemeAccountController(schemeAccountUseCase);

router.get('/schemeaccounts', (req, res) => schemeAccountController.getSchemeAccounts(req, res));
router.get('/schemeaccount/branch/:branchId/customer/search', (req, res) => schemeAccountController.searchCustomerByMobile(req, res));
router.post('/schemeaccount/search', (req, res) => schemeAccountController.customMobileSearch(req, res));
router.post('/schemeaccount/close/:mobile/branch/:branchId', (req, res) => schemeAccountController.sendOtpForClose(req, res));
router.post('/schemeaccount/verifyotp', (req, res) => schemeAccountController.verifyOtp(req, res));
router.patch('/schemeaccount/:id/close', (req, res) => schemeAccountController.closeSchemeAccount(req, res));

export default router;

