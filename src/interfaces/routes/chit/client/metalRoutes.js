import express from 'express';
import MetalController from '../../../controllers/chit/admin/client/metalController.js';
import MetalRepositroy from '../../../../infrastructure/repositories/chit/MetalRepository.js';
import MetalUseCase from '../../../../usecases/auth/chit/client/MetalUseCase.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/validation.js';
import S3Service from '../../../../utils/s3Bucket.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
import {upload} from '../../../../utils/multer.js';
import HashingService from '../../../../utils/bcrypt.js';
const router = express.Router();

const tokenService= new TokenService();
const hashingService= new HashingService();
const validator = new Validator()
const s3service= new S3Service();
const authMiddleware= new AuthMiddleware(tokenService)

const metalRepository= new MetalRepositroy();
const metalUseCase= new MetalUseCase(metalRepository);

const metalController= new MetalController(metalUseCase,validator);

/**
 * @swagger
 * tags:
 *   name: Metal
 *   description: Management of metal types (Gold, Silver, etc.)
 */

/**
 * @swagger
 * /api/client/metal:
 *   get:
 *     summary: Get all active metals
 *     tags: [Metal]
 *   post:
 *     summary: Add a new metal type
 *     tags: [Metal]
 *     security:
 *       - bearerAuth: []
 */
router.get('/',(req,res)=>metalController.getAllMetals(req,res));

/**
 * @swagger
 * /api/client/metal/{id}:
 *   get:
 *     summary: Get metal by ID
 *     tags: [Metal]
 *   patch:
 *     summary: Edit metal details
 *     tags: [Metal]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a metal type
 *     tags: [Metal]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id',(req,res)=>metalController.getMetalById(req,res));
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/metal/table:
 *   post:
 *     summary: Get metals table data
 *     tags: [Metal]
 *     security:
 *       - bearerAuth: []
 */
router.post('/table',(req,res)=>metalController.metalTableData(req,res));
router.post('/',(req,res)=>metalController.addMetal(req,res));
router.patch('/:id',(req,res)=>metalController.editMetal(req,res));
router.delete('/:id',(req,res)=>metalController.deleteMetal(req,res));

/**
 * @swagger
 * /api/client/metal/{id}/active:
 *   patch:
 *     summary: Toggle metal active status
 *     tags: [Metal]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',(req,res)=>metalController.toggleMetalActiveState(req,res));

export default router;