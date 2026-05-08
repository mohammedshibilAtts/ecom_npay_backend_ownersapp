import express from "express";
import DashboardController from "../../../controllers/chit/admin/client/dashboardController.js";
import DashboardUseCase from "../../../../usecases/auth/chit/client/dashboardUseCase.js";
import BranchRepository from "../../../../infrastructure/repositories/chit/brachRepository.js";
import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";
import DashboardRepository from "../../../../infrastructure/repositories/chit/dashboardRepository.js";

const router = express.Router();

const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

const brachRepository = new BranchRepository();
const dashboardRepository = new DashboardRepository();

const dashboardUseCase = new DashboardUseCase(
  brachRepository,
  dashboardRepository,
);
const dashboardController = new DashboardController(dashboardUseCase);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: High-level overview and real-time statistics
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/dashboard/overall:
 *   post:
 *     summary: Get overall dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.post("/overall", (req, res) => dashboardController.getAllOver(req, res));

/**
 * @swagger
 * /api/client/dashboard/accountreview:
 *   post:
 *     summary: Get account review statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.post("/accountreview", (req, res) =>
  dashboardController.accountStat(req, res),
);

/**
 * @swagger
 * /api/client/dashboard/account:
 *   post:
 *     summary: Get basic account stats
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.post("/account", (req, res) => dashboardController.account(req, res));

/**
 * @swagger
 * /api/client/dashboard/summary/paymentmode:
 *   post:
 *     summary: Get summary grouped by payment mode
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.post("/summary/paymentmode", (req, res) =>
  dashboardController.getPaymetModeSummay(req, res),
);

/**
 * @swagger
 * /api/client/dashboard/paymenthistory:
 *   post:
 *     summary: Get recent payment history
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.post("/paymenthistory", (req, res) =>
  dashboardController.getPaymentHistory(req, res),
);

/**
 * @swagger
 * /api/client/dashboard/paymentmodehistory:
 *   post:
 *     summary: Get detailed payment mode data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.post("/paymentmodehistory", (req, res) =>
  dashboardController.paymentModeData(req, res),
);

/**
 * @swagger
 * /api/client/dashboard/monthly-insights:
 *   post:
 *     summary: Get month-over-month insights
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.post("/monthly-insights", (req, res) =>
  dashboardController.getMonthlyInsights(req, res),
);

/**
 * @swagger
 * /api/client/dashboard/settlements:
 *   post:
 *     summary: Get settlement tracking data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.post("/settlements", (req, res) =>
  dashboardController.getSettlements(req, res),
);

/**
 * @swagger
 * /api/client/dashboard/refunds:
 *   post:
 *     summary: Get refund tracking data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/client/dashboard/bulk:
 *   post:
 *     summary: Get multiple dashboard stats in one request
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.post("/bulk", (req, res) => dashboardController.getBulkStats(req, res));

export default router;
