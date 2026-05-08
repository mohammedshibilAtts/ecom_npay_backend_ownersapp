import express from 'express';
import PurityController from '../../../controllers/chit/admin/client/purityController.js';
import PurityUseCase from '../../../../usecases/auth/chit/client/purityUseCases.js';
import PuriytRepository from '../../../../infrastructure/repositories/chit/purityReporsitory.js';
import TokenService from '../../../../utils/jwtToken.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';
import Validator from '../../../../utils/validations/purityValidations.js';
import MetalRateRepository from '../../../../infrastructure/repositories/chit/metalRateRepository.js';


const router= express.Router();

const purityReporsitory= new  PuriytRepository();
const metalRateRepo = new MetalRateRepository()
const purityUseCases= new  PurityUseCase(purityReporsitory,metalRateRepo);

const toekSerivice= new  TokenService();
const authMiddleware= new AuthMiddleware(toekSerivice);
const validator= new Validator()

const purityController= new PurityController(purityUseCases,validator)

/**
 * @swagger
 * tags:
 *   name: Purity
 *   description: Management of metal purity (24K, 22K, etc.)
 */

/**
 * @swagger
 * /api/client/purity/table:
 *   post:
 *     summary: Get purity table data
 *     tags: [Purity]
 */
router.post("/table",(req,res)=>purityController.puityTable(req,res));

/**
 * @swagger
 * /api/client/purity:
 *   get:
 *     summary: Get all purity types
 *     tags: [Purity]
 *   post:
 *     summary: Add a new purity type
 *     tags: [Purity]
 *     security:
 *       - bearerAuth: []
 */
router.get("/",(req,res)=>purityController.getAllPurity(req,res));

/**
 * @swagger
 * /api/client/purity/{id}:
 *   get:
 *     summary: Get purity by ID
 *     tags: [Purity]
 *   patch:
 *     summary: Update purity details
 *     tags: [Purity]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a purity type
 *     tags: [Purity]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id',(req,res)=>purityController.getPurityById(req,res));
router.use(authMiddleware.protect);
router.post('/',(req,res)=>purityController.addPurity(req,res));
router.patch('/:id',(req,res)=>purityController.updatePurity(req,res));

/**
 * @swagger
 * /api/client/purity/{id}/active:
 *   patch:
 *     summary: Toggle purity active status
 *     tags: [Purity]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',(req,res)=>purityController.activatePurity(req,res));
router.delete('/:id',(req,res)=>purityController.deletePurity(req,res));

/**
 * @swagger
 * /api/client/purity/{id}/display:
 *   patch:
 *     summary: Update purity display settings
 *     tags: [Purity]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/display',(req,res)=>purityController.purityDisplaySettings(req,res));

/**
 * @swagger
 * /api/client/purity/metal/{id}:
 *   get:
 *     summary: Get purity types by metal ID
 *     tags: [Purity]
 */
router.get('/metal/:id',(req,res)=>purityController.getPurityByMetalId(req,res))

export default router;