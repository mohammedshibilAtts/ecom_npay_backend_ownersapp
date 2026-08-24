import express from "express";
import PaymentController from "../../../controllers/chit/admin/client/paymentController.js";
import PaymentRepository from "../../../../infrastructure/repositories/chit/paymentRepository.js";
import MetalRateRepository from "../../../../infrastructure/repositories/chit/metalRateRepository.js";
import SchemeRepository from "../../../../infrastructure/repositories/chit/schemeRepository.js";
import CustomerRepository from "../../../../infrastructure/repositories/chit/CustomerRepository.js";
import PaymentUseCase from "../../../../usecases/auth/chit/client/paymentUseCase.js";
import SchemeAccountRepository from "../../../../infrastructure/repositories/chit/schemeAccountRepository.js";
import SchemeAccountUseCase from "../../../../usecases/auth/chit/client/schemeAccountUseCase.js";
import CustomerRewardRepository from "../../../../infrastructure/repositories/chit/customerRewardRepository.js";
import TransactionDetailsRepository from "../../../../infrastructure/repositories/chit/transactionDetailsRepository.js";
import TransactionRepository from "../../../../infrastructure/repositories/chit/transactionRepository.js";
import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";
import SmsSettingRepository from "../../../../infrastructure/repositories/chit/super/smsSettingRepository.js";
import TopupRepository from "../../../../infrastructure/repositories/chit/topupRepository.js";
import PaymentOrderRepository from "../../../../infrastructure/repositories/chit/paymentOrderRepository.js";
import PaymentModeRepository from "../../../../infrastructure/repositories/chit/PaymentModeRepository.js";
import WalletRepository from "../../../../infrastructure/repositories/chit/walletRepository.js";
import EmployeeRepository from "../../../../infrastructure/repositories/chit/EmployeeRepository.js";
import NotificationConfigRepository from "../../../../infrastructure/repositories/chit/notificationConfigRepository.js";

// for save and print
import PrintRepository from "../../../../infrastructure/repositories/chit/printRepository.js";
import PrintUseCase from "../../../../usecases/auth/chit/client/printUsecase.js";
import DeletePaymentUseCase from "../../../../usecases/auth/chit/client/DeletePaymentUseCase.js";

const router = express.Router();

const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

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

const paymentUseCase = new PaymentUseCase(
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
  notificationconfig,
);

const schemAccoutUseCase = new SchemeAccountUseCase(
  schemeAccountRepository,
  null,
  null,
  null,
  customerRepo,
);

// for save and print
const printRepository = new PrintRepository();
const printUseCase = new PrintUseCase(printRepository);

// New DeletePaymentUseCase instantiation
const deletePaymentUseCase = new DeletePaymentUseCase(
  paymentRepository,
  schemeAccountRepository,
  walletRepo,
  transactionRepository,
  transactionDetailsRepository,
);

const paymentController = new PaymentController(
  paymentUseCase,
  schemAccoutUseCase,
  printUseCase,
  deletePaymentUseCase,
); // Added deletePaymentUseCase

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment processing and transaction history
 */

/**
 * @swagger
 * /api/client/payment/mobile/webhook:
 *   post:
 *     summary: Payment gateway webhook
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post("/mobile/webhook", (req, res) =>
  paymentController.webhook(req, res),
);
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/payment:
 *   post:
 *     summary: Add a manual payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_scheme_account:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Payment recorded
 */
router.post("/", (req, res) => paymentController.addPayment(req, res));

/**
 * @swagger
 * /api/client/payment/schacc:
 *   get:
 *     summary: Get payments by scheme account
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get("/schacc", (req, res) =>
  paymentController.getPaymentBySchemeAccount(req, res),
);

/**
 * @swagger
 * /api/client/payment/schacc/web:
 *   get:
 *     summary: Get payments by scheme account (without mobile flag)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get("/schacc/web", (req, res) =>
  paymentController.getPaymentBySchemeAccountWeb(req, res),
);

/**
 * @swagger
 * /api/client/payment/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment details
 *   delete:
 *     summary: Delete a payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment deleted
 */
router.get("/:id", (req, res) => paymentController.getPaymentById(req, res));

/**
 * @swagger
 * /api/client/payment/metalrate/{date}:
 *   get:
 *     summary: Get metal rate for a specific date
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Metal rate data
 */
router.get("/metalrate/:date", (req, res) =>
  paymentController.getTodayMetalRate(req, res),
);

/**
 * @swagger
 * /api/client/payment/table:
 *   post:
 *     summary: Get payments table data
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Table data
 */
router.post("/table", (req, res) => paymentController.paymentTable(req, res));

/**
 * @swagger
 * /api/client/payment/schemeaccount/{id}:
 *   get:
 *     summary: Get payments by scheme ID
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get("/schemeaccount/:id", (req, res) =>
  paymentController.getPaymentsBySchemeId(req, res),
);

router.delete("/:id", authMiddleware.protect, (req, res) =>
  paymentController.deletePayment(req, res),
); // New DELETE route

/**
 * @swagger
 * /api/client/payment/mobile/create-order:
 *   post:
 *     summary: Create a mobile payment order
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order created
 */
router.post("/mobile/create-order", (req, res) =>
  paymentController.processPayment(req, res),
);

/**
 * @swagger
 * /api/client/payment/mobile/payment-status:
 *   get:
 *     summary: Check mobile payment status
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status retrieved
 */
router.get("/mobile/payment-status", (req, res) =>
  paymentController.paymentStatus(req, res),
);

/**
 * @swagger
 * /api/client/payment/mobile/digi-payment:
 *   post:
 *     summary: Process DigiGold payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment processed
 */
router.post("/mobile/digi-payment", (req, res) =>
  paymentController.digiGoldPayment(req, res),
);

export default router;
