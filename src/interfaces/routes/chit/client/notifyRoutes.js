import express from 'express';
import PushNotificationUseCase from '../../../../usecases/auth/chit/client/pushNotificationUseCase.js';
import PushNotificationRepository from '../../../../infrastructure/repositories/chit/pushNotificationRepository.js';
import TokenSerivce from '../../../../utils/jwtToken.js'
import { upload } from "../../../../utils/multer.js";
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';
import NotifyController from '../../../controllers/chit/admin/client/notifyController.js';
import S3Service from '../../../../utils/s3Bucket.js'
import CustomersRepository from '../../../../infrastructure/repositories/chit/CustomerRepository.js'
import NotificationRepository from '../../../../infrastructure/repositories/chit/super/notificationRepository.js'
import S3Repo from '../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js'

const router = express.Router()

const pushnotificationRepo = new PushNotificationRepository()
const s3Service = new S3Service()
const customersRepository = new CustomersRepository();
const notificationRespository = new NotificationRepository()
const s3Respo = new S3Repo()
const pushnotificaitonUsecase = new PushNotificationUseCase(pushnotificationRepo,s3Service,customersRepository,notificationRespository,s3Respo);
const tokenService = new TokenSerivce()
const authMiddleware = new AuthMiddleware(tokenService);

const notifyController = new NotifyController(pushnotificaitonUsecase)

/**
 * @swagger
 * tags:
 *   name: Notify
 *   description: Special notifications, promotions, and customer alerts
 */

router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/client/notify:
 *   post:
 *     summary: Add a general notification
 *     tags: [Notify]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 */
router.post('/',upload.handleUpload([{ name: "image", maxCount: 1 }]),(req,res)=>notifyController.addNotification(req,res))

/**
 * @swagger
 * /api/client/notify/promotion:
 *   post:
 *     summary: Add a promotional notification
 *     tags: [Notify]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 */
router.post('/promotion',upload.handleUpload([{ name: "image", maxCount: 1 }]),(req,res)=>notifyController.addPromotion(req,res))

/**
 * @swagger
 * /api/client/notify/push-notify-table:
 *   post:
 *     summary: Get push notifications list table
 *     tags: [Notify]
 *     security:
 *       - bearerAuth: []
 */
router.post('/push-notify-table',(req,res)=>notifyController.pushnotificationTable(req,res));

/**
 * @swagger
 * /api/client/notify/pormotion-table:
 *   post:
 *     summary: Get promotion notifications list table
 *     tags: [Notify]
 *     security:
 *       - bearerAuth: []
 */
router.post('/pormotion-table',(req,res)=>notifyController.promotionTable(req,res)); // spelling mistake in code: pormotion

/**
 * @swagger
 * /api/client/notify/{id}:
 *   get:
 *     summary: Get notification details by ID
 *     tags: [Notify]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id',(req,res)=>notifyController.getNotificationById(req,res));

/**
 * @swagger
 * /api/client/notify/schemecustomers:
 *   post:
 *     summary: Get customers associated with a scheme for notification
 *     tags: [Notify]
 *     security:
 *       - bearerAuth: []
 */
router.post("/schemecustomers",(req,res)=>notifyController.getSchemeCustomers(req,res))
router.post("/customers",(req,res)=>notifyController.getCustomers(req,res))
// router.post('/table',(req,res)=>notifyController.getNotificationList(req,res));

// router.get('/type',(req,res)=>notifyController.getWeddingBirthday(re,res));
// router.delete('/permenentdelete/:id',(req,res)=>notifyController.deletepushnotification(req,res));

export default router;