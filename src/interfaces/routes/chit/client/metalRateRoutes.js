import express from "express";
import metalRateController from "../../../controllers/chit/admin/client/metalRateController.js";
import metalRateUseCase from "../../../../usecases/auth/chit/client/metalRateUseCase.js";
import MetalRateRepository from "../../../../infrastructure/repositories/chit/metalRateRepository.js";
import TokenService from "../../../../utils/jwtToken.js";
import Validator from "../../../../utils/validations/metalRateValidator.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";
import MetalRepository from "../../../../infrastructure/repositories/chit/MetalRepository.js";
import BranchRepository from "../../../../infrastructure/repositories/chit/brachRepository.js";

const router = express.Router();

const tokernService = new TokenService();
const validator = new Validator();
const authMiddleware = new AuthMiddleware(tokernService);

const metalrateRepository = new MetalRateRepository();
const metalRepo = new MetalRepository();
const branchRepo = new BranchRepository();
const metalrateUseCase = new metalRateUseCase(
  metalrateRepository,
  metalRepo,
  branchRepo,
);

const metalrateContorller = new metalRateController(
  metalrateUseCase,
  validator,
);

/**
 * @swagger
 * tags:
 *   name: MetalRate
 *   description: Tracking daily gold and silver rates
 */

/**
 * @swagger
 * /api/client/metalrate/today-rate/branchId/{branchId}:
 *   get:
 *     summary: Get today's rate for a specific branch
 *     tags: [MetalRate]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Today's rate data
 */
router.get("/today-rate/branchId/:branchId", (req, res) =>
  metalrateContorller.metalRatetoday(req, res),
);

/**
 * @swagger
 * /api/client/metalrate/current:
 *   get:
 *     summary: Get current metal rates for all metals
 *     tags: [MetalRate]
 *     responses:
 *       200:
 *         description: Current rates
 */
router.get("/current", (req, res) =>
  metalrateContorller.todaysMetalRateByMetal(req, res),
);

/**
 * @swagger
 * /api/client/metalrate/current-previous/{branchId}:
 *   get:
 *     summary: Get current and previous rates for a branch
 *     tags: [MetalRate]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current and previous rate data
 */
router.get("/current-previous/:branchId", (req, res) =>
  metalrateContorller.currenPreviousMetalRate(req, res),
);

/**
 * @swagger
 * /api/client/metalrate/{id}:
 *   get:
 *     summary: Get metal rate by ID
 *     tags: [MetalRate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rate details
 *   patch:
 *     summary: Edit metal rate
 *     tags: [MetalRate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rate updated
 *   delete:
 *     summary: Delete metal rate
 *     tags: [MetalRate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rate deleted
 */
router.get("/:id", (req, res) => metalrateContorller.getById(req, res));

/**
 * @swagger
 * /api/client/metalrate/today-rate/{branchId}/date/{date}:
 *   get:
 *     summary: Get rates for a specific branch and date
 *     tags: [MetalRate]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *       - in: path
 *         name: date
 *         required: true
 *     responses:
 *       200:
 *         description: Target rates
 */
router.get("/today-rate/:branchId/date/:date", (req, res) =>
  metalrateContorller.todaysMetalRate(req, res),
); 

/**
 * @swagger
 * /api/client/metalrate/table:
 *   post:
 *     summary: Get metal rates table data
 *     tags: [MetalRate]
 *     responses:
 *       200:
 *         description: Table data
 */
router.post("/table", (req, res) =>
  metalrateContorller.metalRateTable(req, res),
);

/**
 * @swagger
 * /api/client/metalrate/history:
 *   post:
 *     summary: Get metal rate history
 *     tags: [MetalRate]
 *     responses:
 *       200:
 *         description: History data
 */
router.post("/history", (req, res) => metalrateContorller.getHistory(req, res));
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/metalrate:
 *   post:
 *     summary: Add new metal rate
 *     tags: [MetalRate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Rate added
 */
router.post("/", (req, res) => metalrateContorller.addMetalRate(req, res));
router.patch("/:id", (req, res) => metalrateContorller.editMetalRate(req, res));
router.delete("/:id", (req, res) =>
  metalrateContorller.deleteMetalRate(req, res),
);

export default router;
