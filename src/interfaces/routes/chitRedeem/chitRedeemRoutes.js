import express from 'express';
import jwt from 'jsonwebtoken';
import ChitRedeemController from '../../controllers/chitRedeem/chitRedeemController.js';
import ChitRedeemUsecase from '../../../usecases/chitRedeem/chitRedeemUsecase.js';
import ChitRedeemRepository from '../../../infrastructure/repositories/chitRedeem/chitRedeemRepository.js';
import SchemeAccountUseCase from '../../../usecases/auth/chit/client/schemeAccountUseCase.js';
import SchemeAccountRepository from '../../../infrastructure/repositories/chit/schemeAccountRepository.js';
import CustomerRepository from '../../../infrastructure/repositories/chit/CustomerRepository.js';
import WalletRepository from '../../../infrastructure/repositories/chit/walletRepository.js';
import DashboardRepository from '../../../infrastructure/repositories/chit/dashboardRepository.js';
import WalletUsecase from '../../../usecases/auth/chit/client/walletUsecase.js';
import BranchRepository from '../../../infrastructure/repositories/chit/brachRepository.js';
import EmployeeRepository from '../../../infrastructure/repositories/chit/EmployeeRepository.js';
import SchemeRepository from '../../../infrastructure/repositories/chit/schemeRepository.js';
import CloseAccRepository from '../../../infrastructure/repositories/chit/closeAccountRepository.js';
import SchemeTypeRepo from '../../../infrastructure/repositories/chit/SchemeTypeRepository.js';
import MetalRepo from '../../../infrastructure/repositories/chit/MetalRepository.js';
import PaymentRepo from '../../../infrastructure/repositories/chit/paymentRepository.js';
import GiftIssuesRepo from '../../../infrastructure/repositories/chit/giftIssuesRepository.js';
import PurityRepo from '../../../infrastructure/repositories/chit/purityReporsitory.js';
import SmsSettingRepository from '../../../infrastructure/repositories/chit/super/smsSettingRepository.js';
import SmsSender from '../../../utils/sendSms.js';
import GeneralSettingRepository from '../../../infrastructure/repositories/chit/super/generalSettingRepository.js';
import OtpRepository from '../../../infrastructure/repositories/chit/otpRepository.js';
import topupRepository from '../../../infrastructure/repositories/chit/topupRepository.js';
import TokenService from '../../../utils/jwtToken.js';
import AuthMiddleware from '../../../utils/middleware/authMiddleware.js';
import config from '../../../config/chit/env.js';


const verifyJwt = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const key = config.ERP_JWT_SECRET_KEY
    const decoded = jwt.verify(token, key);

    req.erpUser = decoded;
    next();
  } catch (error) {
    next()
    console.log("JWT VERIFY ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const router = express.Router();
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

// Repositories
const chitRedeemRepository = new ChitRedeemRepository();
const schemeAccountRepository = new SchemeAccountRepository();
const customerRepository = new CustomerRepository();
const walletRepository = new WalletRepository();
const dashboardRepository = new DashboardRepository();
const branchRepository = new BranchRepository();
const employeeRepository = new EmployeeRepository();
const schemeRepository = new SchemeRepository();
const closeAccRepo = new CloseAccRepository();
const schemeTypeRepo = new SchemeTypeRepo();
const metalRepo = new MetalRepo();
const paymentRepo = new PaymentRepo();
const giftIssueRepo = new GiftIssuesRepo();
const purityRepo = new PurityRepo();
const smsRepo = new SmsSettingRepository();
const smsSender = new SmsSender();
const otpRepo = new OtpRepository();
const generalSettingRepo = new GeneralSettingRepository();
const topupRepo = new topupRepository();

// Use Cases
const walletUsecase = new WalletUsecase(walletRepository, branchRepository);

const schemeAccountUseCase = new SchemeAccountUseCase(
  schemeAccountRepository,
  employeeRepository,
  schemeRepository,
  closeAccRepo,
  customerRepository,
  schemeTypeRepo,
  metalRepo,
  paymentRepo,
  giftIssueRepo,
  purityRepo,
  smsRepo,
  otpRepo,
  smsSender,
  topupRepo
);

const chitRedeemUsecase = new ChitRedeemUsecase(
  chitRedeemRepository,
  schemeAccountUseCase,
  customerRepository,
  walletRepository,
  dashboardRepository,
  walletUsecase
);

// Controller
const chitRedeemController = new ChitRedeemController(chitRedeemUsecase);

// Routes


router.get('/find-account', verifyJwt, (req, res) => chitRedeemController.findSchemeAccount(req, res));
router.post('/', verifyJwt, (req, res) => chitRedeemController.closeAccount(req, res));
router.get('/daybook-report', verifyJwt, (req, res) => chitRedeemController.dayBookReport(req, res));
router.patch('/wallet/add', verifyJwt, (req, res) => chitRedeemController.addWalletPoints(req, res));
router.post('/wallet/redeem', verifyJwt, (req, res) => chitRedeemController.redeemWalletPoints(req, res));

export default router;
