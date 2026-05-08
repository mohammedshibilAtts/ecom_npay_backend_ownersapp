import express from 'express';
import TicketRaiseController from '../../../controllers/chit/admin/client/ticketRaiseController.js';
import TicketRaiseRepository from '../../../../infrastructure/repositories/chit/ticketRaiseRepository.js';
import TicketRaiseUseCase from '../../../../usecases/auth/chit/client/ticketRaiseUsecase.js';
import TokenService from '../../../../utils/jwtToken.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';
import Validator from '../../../../utils/validations/raiseTicketValidation.js';
import { upload } from "../../../../utils/multer.js";
import S3Service from '../../../../utils/s3Bucket.js';
import S3BucketRepository from '../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js';

const router= express.Router();


const s3Service=new S3Service()
const tokenSerivice= new  TokenService();
const s3Repo = new S3BucketRepository()
const authMiddleware= new AuthMiddleware(tokenSerivice);
const validator= new Validator()

const ticketRaiseRepository=new TicketRaiseRepository()
const ticketRaiseUsecase=new TicketRaiseUseCase(ticketRaiseRepository,s3Service,s3Repo)
const ticketRaiseController= new TicketRaiseController(ticketRaiseUsecase,validator)

/**
 * @swagger
 * tags:
 *   name: Ticket
 *   description: Customer support ticket raising and management
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/ticketraise:
 *   post:
 *     summary: Raise a new support ticket (with optional image)
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_img:
 *                 type: string
 *                 format: binary
 */
router.post('/',upload.handleUpload([{name:"ticket_img",maxCount:1}]),(req,res)=>ticketRaiseController.addTicket(req,res))

/**
 * @swagger
 * /api/client/ticketraise/table:
 *   post:
 *     summary: Get tickets history table
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 */
router.post('/table',(req,res)=>ticketRaiseController.getTicket(req,res))

export default router;