import express from 'express';
import SchemeAccountContorller from '../../../controllers/chit/admin/client/schemeAccountController.js';
import SchemeAccountUseCase from '../../../../usecases/auth/chit/client/schemeAccountUseCase.js';
import SchemeAccountRepository from '../../../../infrastructure/repositories/chit/schemeAccountRepository.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/schemeAccountValidator.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';
import EmployeeRepository from '../../../../infrastructure/repositories/chit/EmployeeRepository.js';
import SchemeRepository from '../../../../infrastructure/repositories/chit/schemeRepository.js';
import ClosAccRepository from '../../../../infrastructure/repositories/chit/closeAccountRepository.js';
import CustomerRepository from '../../../../infrastructure/repositories/chit/CustomerRepository.js'
import SchemeTypeRepo from '../../../../infrastructure/repositories/chit/SchemeTypeRepository.js'
import MetalRepo from '../../../../infrastructure/repositories/chit/MetalRepository.js';
import PaymentRepo from '../../../../infrastructure/repositories/chit/paymentRepository.js';
import GiftIssuesRepo from '../../../../infrastructure/repositories/chit/giftIssuesRepository.js';
import PurityRepo from '../../../../infrastructure/repositories/chit/purityReporsitory.js';
import SmsSettingRepository from '../../../../infrastructure/repositories/chit/super/smsSettingRepository.js';
import SmsSender from '../../../../utils/sendSms.js';
import OtpRepository from '../../../../infrastructure/repositories/chit/otpRepository.js';
import topupRepository from '../../../../infrastructure/repositories/chit/topupRepository.js';

const router = express.Router();
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);
const validator = new Validator();

const schemetypeRepo = new SchemeTypeRepo();
const metalRepo = new MetalRepo();
const paymentRepo = new PaymentRepo();
const giftIssueRepo = new GiftIssuesRepo()
const schemeRespo = new SchemeRepository()
const purityRepo = new PurityRepo()
const schemeAccountRepository = new SchemeAccountRepository();
const employeeRepository = new EmployeeRepository()
const closeAccRepo = new ClosAccRepository()
const customerRepo = new CustomerRepository()
const smsRepo = new SmsSettingRepository()
const smsSender = new SmsSender()
const otpRepo = new OtpRepository()
const topupRepo = new topupRepository()
const schemAccoutUseCase = new SchemeAccountUseCase(schemeAccountRepository, employeeRepository, schemeRespo,
    closeAccRepo, customerRepo, schemetypeRepo, metalRepo, paymentRepo, giftIssueRepo, purityRepo, smsRepo, otpRepo, smsSender, topupRepo
)

const schemeAccountController = new SchemeAccountContorller(schemAccoutUseCase, validator)

/**
 * @swagger
 * tags:
 *   name: SchemeAccount
 *   description: Customer chit accounts management
 */

router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/client/schemeaccount/overdue:
 *   get:
 *     summary: Calculate overdue for accounts
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue calculated
 */
router.get('/overdue', (req, res) => schemeAccountController.overdueCalculation(req, res))

/**
 * @swagger
 * /api/client/schemeaccount/search:
 *   post:
 *     summary: Search scheme accounts by mobile
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Search results
 */
router.post('/search', (req, res) => schemeAccountController.customMobileSearch(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/revert:
 *   get:
 *     summary: Get reverted details
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reverted details
 */
router.get('/revert', (req, res) => schemeAccountController.getRevertedDetails(req, res))

/**
 * @swagger
 * /api/client/schemeaccount/accountcount:
 *   get:
 *     summary: Find customer account counts
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account counts
 */
router.get('/accountcount', (req, res) => schemeAccountController.findCustomerAccountCounts(req, res))

/**
 * @swagger
 * /api/client/schemeaccount:
 *   post:
 *     summary: Add a new scheme account
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       210:
 *         description: Account created
 *   get:
 *     summary: Get all scheme accounts
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 */
router.post('/', (req, res) => schemeAccountController.addSchemeAccount(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/{id}:
 *   patch:
 *     summary: Edit scheme account
 *     tags: [SchemeAccount]
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
 *         description: Account updated
 *   delete:
 *     summary: Delete scheme account
 *     tags: [SchemeAccount]
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
 *         description: Account deleted
 *   get:
 *     summary: Get scheme account by ID
 *     tags: [SchemeAccount]
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
 *         description: Account details
 */
router.patch('/:id', (req, res) => schemeAccountController.editSchemeAccount(req, res));
router.delete('/:id', (req, res) => schemeAccountController.deleteSchemeAccount(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/{id}/active:
 *   patch:
 *     summary: Toggle account active status
 *     tags: [SchemeAccount]
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
 *         description: Status updated
 */
router.patch('/:id/active', (req, res) => schemeAccountController.activateSchemeAccount(req, res));
router.get('/', (req, res) => schemeAccountController.getAllSchemeAccounts(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/table:
 *   post:
 *     summary: Get scheme accounts table data
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Table data
 */
router.post('/table', (req, res) => schemeAccountController.getSchemeAccountTable(req, res))

/**
 * @swagger
 * /api/client/schemeaccount/{id}/revert:
 *   patch:
 *     summary: Revert a scheme account
 *     tags: [SchemeAccount]
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
 *         description: Account reverted
 */
router.patch('/:id/revert', (req, res) => schemeAccountController.revertSchemeAccount(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/{id}/close:
 *   patch:
 *     summary: Close a scheme account
 *     tags: [SchemeAccount]
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
 *         description: Account closed
 */
router.patch('/:id/close', (req, res) => schemeAccountController.closeSchemeAccount(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/{id}/extendinstallment:
 *   patch:
 *     summary: Extend account installment
 *     tags: [SchemeAccount]
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
 *         description: Installment extended
 */
router.patch('/:id/extendinstallment', (req, res) => schemeAccountController.extendInstallment(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/branch/{branchId}/customer/search:
 *   get:
 *     summary: Search customer by mobile in branch
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/branch/:branchId/customer/search', (req, res) => schemeAccountController.searchCustomerByMobile(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/branch/{branchId}/customer/{customerId}:
 *   get:
 *     summary: Get customer account in branch
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account details
 */
router.get('/branch/:branchId/customer/:customerId', (req, res) => schemeAccountController.getCustomerAccount(req, res));
router.get('/:id', (req, res) => schemeAccountController.getSchemeAccountById(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/{accId}/payment:
 *   get:
 *     summary: Get payments by account ID
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment list
 */
router.get('/:accId/payment', (req, res) => schemeAccountController.getPaymentByAccNumber(req, res))

/**
 * @swagger
 * /api/client/schemeaccount/close/{mobile}/branch/{branchId}:
 *   post:
 *     summary: Send OTP for account closure
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP Sent
 */
router.post('/close/:mobile/branch/:branchId', (req, res) => schemeAccountController.sendOtpForClose(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/verifyotp:
 *   post:
 *     summary: Verify OTP for account closure
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post('/verifyotp', (req, res) => schemeAccountController.verifyOtp(req, res))

/**
 * @swagger
 * /api/client/schemeaccount/accnum/mobile/search:
 *   get:
 *     summary: Search account by mobile number
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/accnum/mobile/search', (req, res) => schemeAccountController.searchAccMobile(req, res));


/**
 * @swagger
 * /api/client/schemeaccount/mobile/schemeaccounts:
 *   get:
 *     summary: Get all scheme accounts for mobile app
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 */
router.get('/mobile/schemeaccounts', (req, res) => schemeAccountController.getAllSchemeAccountsForMobile(req, res));

/**
 * @swagger
 * /api/client/schemeaccount/mobile/metalsavings:
 *   get:
 *     summary: Get metal based savings for mobile app
 *     tags: [SchemeAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metal savings data
 */
router.get('/mobile/metalsavings', (req, res) => schemeAccountController.getMetalBasedSavings(req, res));

//*coupon
router.post('/coupon/find', (req, res) => schemeAccountController.searchSchemeAccountData(req, res));

export default router;