import express from "express";
import NotificationConfigController from "../../../controllers/chit/admin/client/notificationConfigController.js";
import NotificationConfigRepository from "../../../../infrastructure/repositories/chit/notificationConfigRepository.js";
import NotificationConfigUsecase from "../../../../usecases/auth/chit/client/notificationConfigUseCase.js";
import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";

const router = express.Router();

const notificationConfigRepo = new NotificationConfigRepository();
const notificationConfigUsecase = new NotificationConfigUsecase(notificationConfigRepo);
const notificationConfigController = new NotificationConfigController(notificationConfigUsecase);
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

/**
 * @swagger
 * tags:
 *   name: NotificationConfig
 *   description: Personal notification settings and configurations
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/notification-config:
 *   get:
 *     summary: Get notification config for current user
 *     tags: [NotificationConfig]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Save or update notification config
 *     tags: [NotificationConfig]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", (req, res) => notificationConfigController.saveOrUpdateConfig(req, res));
router.get("/", (req, res) => notificationConfigController.getConfigByUser(req, res));

/**
 * @swagger
 * /api/client/notification-config/all:
 *   get:
 *     summary: Get all notification configs (Admin)
 *     tags: [NotificationConfig]
 *     security:
 *       - bearerAuth: []
 */
router.get("/all", (req, res) => notificationConfigController.getAllConfigs(req, res));

/**
 * @swagger
 * /api/client/notification-config/{id}:
 *   delete:
 *     summary: Delete notification config
 *     tags: [NotificationConfig]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", (req, res) => notificationConfigController.deleteConfig(req, res));

export default router;
