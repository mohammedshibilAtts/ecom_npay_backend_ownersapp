import express from 'express';
import NotificationSettingController from '../../../controllers/chit/admin/super/notificationSettingController.js';
import NotificationSettingUseCase from '../../../../usecases/auth/chit/admin/notificationSettingUseCase.js';
import NotificationSettingRepository from '../../../../infrastructure/repositories/chit/super/notificationRepository.js';
import TokenService from '../../../../utils/jwtToken.js';
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js"


const router= express.Router()
const tokenService = new TokenService();
const authMiddleWare= new AuthMiddleware(tokenService);

const notificationRepo = new NotificationSettingRepository();
const notificationUseCase = new NotificationSettingUseCase(notificationRepo);

const notificationController = new NotificationSettingController(notificationUseCase);

/**
 * @swagger
 * tags:
 *   name: AdminNotification
 *   description: System-level notification provider configuration
 */

router.use(authMiddleWare.protect)

/**
 * @swagger
 * /api/admin/notificationsetting:
 *   post:
 *     summary: Add or update notification provider setting
 *     tags: [AdminNotification]
 *     security:
 *       - bearerAuth: []
 */
router.post('/',(req,res)=>notificationController.addNotificationSetting(req,res));

/**
 * @swagger
 * /api/admin/notificationsetting/branch/{branchId}:
 *   get:
 *     summary: Get notification setting by branch
 *     tags: [AdminNotification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/branch/:branchId',(req,res)=>notificationController.getNotificationSettByBranchId(req,res));

/**
 * @swagger
 * /api/admin/notificationsetting/project/{projectId}/branch/{branchId}:
 *   get:
 *     summary: Get notification setting by project and branch
 *     tags: [AdminNotification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/project/:projectId/branch/:branchId',(req,res)=>notificationController.getSettingByProjectAndBranchId(req,res))




export default router;