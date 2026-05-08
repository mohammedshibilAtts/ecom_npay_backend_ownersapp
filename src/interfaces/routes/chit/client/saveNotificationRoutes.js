import express from 'express';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';
import TokenService from '../../../../utils/jwtToken.js';
// import { upload } from "../../../../utils/multer.js";
// import S3Service from '../../../../utils/s3Bucket.js';
// import S3BucketRepository from '../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js';
import SaveNotificationRepo from '../../../../infrastructure/repositories/chit/saveNotificationRepo.js';
import SaveNotificationUsecase from '../../../../usecases/auth/chit/client/saveNotificationUsecase.js';
import saveNotificationController from '../../../controllers/chit/admin/client/saveNotificationController.js';


const router = express.Router();

const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService)

const savenotificaitonRepo = new SaveNotificationRepo()
const savednotificationUsecase = new SaveNotificationUsecase(savenotificaitonRepo)
const savenotificationController = new saveNotificationController(savednotificationUsecase)

/**
 * @swagger
 * tags:
 *   name: SavedNotification
 *   description: User-specific saved notification history and status
 */

router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/client/notification:
 *   get:
 *     summary: Get notifications for current user
 *     tags: [SavedNotification]
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Update notification status (Toggle read/unread)
 *     tags: [SavedNotification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/',(req,res)=>savenotificationController.getUserNotifications(req,res));
router.patch('/',(req,res)=>savenotificationController.updateNotificationStatus(req,res))

/**
 * @swagger
 * /api/client/notification/clear:
 *   patch:
 *     summary: Clear all notifications for user
 *     tags: [SavedNotification]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/clear',(req,res)=>savenotificationController.clearAllNotification(req,res))

/**
 * @swagger
 * /api/client/notification/read:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [SavedNotification]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/read',(req,res)=>savenotificationController.readAllNotification(req,res))

/**
 * @swagger
 * /api/client/notification/count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [SavedNotification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/count',(req,res)=>savenotificationController.notificationCount(req,res));

export default router;