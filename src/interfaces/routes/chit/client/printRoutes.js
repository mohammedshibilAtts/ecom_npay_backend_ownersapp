import express from 'express';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';
import TokenService from '../../../../utils/jwtToken.js';
import PrintUseCase from '../../../../usecases/auth/chit/client/printUsecase.js';
import PrintRepository from '../../../../infrastructure/repositories/chit/printRepository.js';
import PrintController from '../../../controllers/chit/admin/client/printController.js';



const router = express.Router();

const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService)

const printRepository = new PrintRepository()
const printUseCase = new PrintUseCase(printRepository)
const printController = new PrintController(printUseCase)

/**
 * @swagger
 * tags:
 *   name: Print
 *   description: Generation of physical receipts and passbooks
 */

router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/client/print/receipt:
 *   post:
 *     summary: Get receipt data
 *     tags: [Print]
 *     security:
 *       - bearerAuth: []
 */
router.post('/receipt',(req,res)=>printController.getReceipt(req,res))

/**
 * @swagger
 * /api/client/print/receipt/print:
 *   post:
 *     summary: Get receipt data by payment ID
 *     tags: [Print]
 *     security:
 *       - bearerAuth: []
 */
router.post('/receipt/print',(req,res)=>printController.getReceiptByPaymentId(req,res));

/**
 * @swagger
 * /api/client/print/passbook:
 *   post:
 *     summary: Get passbook data for a customer/account
 *     tags: [Print]
 *     security:
 *       - bearerAuth: []
 */
router.post('/passbook',(req,res)=>printController.getPassbookData(req,res))


export default router;