import express from 'express';
import PushNotificationUseCase from '../../../../usecases/auth/chit/client/pushNotificationUseCase.js';
import PushNotificationRepository from '../../../../infrastructure/repositories/chit/pushNotificationRepository.js';
import TokenSerivce from '../../../..//utils/jwtToken.js'
import { upload } from "../../../../utils/multer.js";
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';
import PushNotificationController from '../../../controllers/chit/admin/client/pushNotificationController.js';
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

const pushnotificaitonCntroller = new PushNotificationController(pushnotificaitonUsecase)

/**
 * @swagger
 * tags:
 *   name: PushNotification
 *   description: Sending and managing push notifications to customers
 */

router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/client/pushnotificaiton:
 *   get:
 *     summary: Get all push notifications
 *     tags: [PushNotification]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Add and send new push notification
 *     tags: [PushNotification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               push_img:
 *                 type: string
 *                 format: binary
 */
router.get("/", (req, res) => pushnotificaitonCntroller.getAllNotifications(req, res));
router.post("/", upload.handleUpload([{ name: "push_img", maxCount: 1 }]), (req, res) => pushnotificaitonCntroller.addPushNotification(req, res));

/**
 * @swagger
 * /api/client/pushnotificaiton/{id}:
 *   delete:
 *     summary: Delete push notification
 *     tags: [PushNotification]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", (req, res) => pushnotificaitonCntroller.deleteNotification(req, res));

/**
 * @swagger
 * /api/client/pushnotification/table:
 *   post:
 *     summary: Get push notifications history table
 *     tags: [PushNotification]
 *     security:
 *       - bearerAuth: []
 */
router.post('/table',(req,res)=>pushnotificaitonCntroller.pushnotificationTable(req,res));

/**
 * @swagger
 * /api/client/pushnotification/{id}:
 *   get:
 *     summary: Get push notification details
 *     tags: [PushNotification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id',(req,res)=>pushnotificaitonCntroller.getPushNotoficationById(req,res));

/**
 * @swagger
 * /api/client/pushnotification/type:
 *   get:
 *     summary: Get wedding/birthday special notifications
 *     tags: [PushNotification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/type',(req,res)=>pushnotificaitonCntroller.getWeddingBirthday(re,res));

/**
 * @swagger
 * /api/client/pushnotification/permenentdelete/{id}:
 *   delete:
 *     summary: Permanently delete a notification
 *     tags: [PushNotification]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/permenentdelete/:id',(req,res)=>pushnotificaitonCntroller.deletepushnotification(req,res));

export default router;