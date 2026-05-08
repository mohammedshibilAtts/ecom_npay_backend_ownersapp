import express from 'express';
import PaymentModeController from '../../../controllers/chit/admin/client/PaymentModeController.js';
import PaymentModeRepository from '../../../../infrastructure/repositories/chit/PaymentModeRepository.js';
import PaymentModeUseCase from '../../../../usecases/auth/chit/client/PaymentModeUseCase.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/validation.js';
import S3Service from '../../../../utils/s3Bucket.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
import {upload} from '../../../../utils/multer.js';
import HashingService from '../../../../utils/bcrypt.js';

const router = express.Router();

const tokenService= new TokenService();
const hashingService= new HashingService();
const validator = new Validator()
const s3service= new S3Service();
const authMiddleware= new AuthMiddleware(tokenService);

const paymentmodeRepository= new PaymentModeRepository();
const paymentmodeUseCase= new PaymentModeUseCase(paymentmodeRepository);

const paymentmodeController = new PaymentModeController(validator,paymentmodeUseCase,);

/**
 * @swagger
 * tags:
 *   name: PaymentMode
 *   description: Management of supported payment modes (UPI, Cash, Bank, etc.)
 */

/**
 * @swagger
 * /api/client/paymentmode/table:
 *   post:
 *     summary: Get payment modes table data
 *     tags: [PaymentMode]
 */
router.post('/table',(req,res)=>paymentmodeController.paymentModeTable(req,res));

/**
 * @swagger
 * /api/client/paymentmode:
 *   get:
 *     summary: Get all active payment modes
 *     tags: [PaymentMode]
 *   post:
 *     summary: Add a new payment mode
 *     tags: [PaymentMode]
 *     security:
 *       - bearerAuth: []
 */
router.get('/',(req,res)=>paymentmodeController.getAllActivePaymentModes(req,res));

/**
 * @swagger
 * /api/client/paymentmode/{id}:
 *   get:
 *     summary: Get payment mode by ID
 *     tags: [PaymentMode]
 *   patch:
 *     summary: Edit payment mode details
 *     tags: [PaymentMode]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a payment mode
 *     tags: [PaymentMode]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id',(req,res)=>paymentmodeController.getModeById(req,res));
router.use(authMiddleware.protect);
router.post('/',(req,res)=>paymentmodeController.addPaymentMode(req,res));
router.patch('/:id',(req,res)=>paymentmodeController.editPaymentMode(req,res));
router.delete('/:id',(req,res)=>paymentmodeController.deletePaymentMode(req,res));

/**
 * @swagger
 * /api/client/paymentmode/{id}/active:
 *   patch:
 *     summary: Toggle payment mode active status
 *     tags: [PaymentMode]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',(req,res)=>paymentmodeController.changeModeActiveStatus(req,res));

export default router;