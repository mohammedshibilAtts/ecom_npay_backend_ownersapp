import express from "express";
import topupController from "../../../controllers/chit/admin/client/topupController.js";
import topupRepository from "../../../../infrastructure/repositories/chit/topupRepository.js";
import topupUsecase from "../../../../usecases/auth/chit/client/topupUsecase.js";
import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";

const router = express.Router();

const topupConfigRepo = new topupRepository();
const topupusecase = new topupUsecase(topupConfigRepo);
const topupConfigController = new topupController(topupusecase);
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

/**
 * @swagger
 * tags:
 *   name: Topup
 *   description: Management of scheme topups and adjustments
 */

router.use(authMiddleware.protect); 

/**
 * @swagger
 * /api/client/topup:
 *   post:
 *     summary: Create a new topup
 *     tags: [Topup]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", (req, res) => topupConfigController.UpdateTopup(req, res));
router.post("/", (req, res) => topupConfigController.addTopUp(req, res));

/**
 * @swagger
 * /api/client/topup/add:
 *   post:
 *     summary: Record topup history
 *     tags: [Topup]
 *     security:
 *       - bearerAuth: []
 */
router.post("/add", (req, res) => topupConfigController.addTopupHistory(req, res));

/**
 * @swagger
 * /api/client/topup/table:
 *   post:
 *     summary: Get topups table data
 *     tags: [Topup]
 *     security:
 *       - bearerAuth: []
 */
router.post("/table", (req, res) => topupConfigController.getAllTopup(req, res));

/**
 * @swagger
 * /api/client/topup/pending:
 *   post:
 *     summary: Get pending topups
 *     tags: [Topup]
 *     security:
 *       - bearerAuth: []
 */
router.post("/pending", (req, res) => topupConfigController.getTopupByStatus(req, res));

/**
 * @swagger
 * /api/client/topup/{id}:
 *   get:
 *     summary: Get topup by client ID
 *     tags: [Topup]
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Update topup details
 *     tags: [Topup]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete topup configuration
 *     tags: [Topup]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", (req, res) => topupConfigController.getTopupByClientId(req, res));
router.delete("/:id", (req, res) => topupConfigController.deleteConfig(req, res));

export default router;
