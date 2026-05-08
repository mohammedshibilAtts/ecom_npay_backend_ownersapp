import express from 'express';
import LayoutSettingController from '../../../controllers/chit/admin/super/layoutSettingController.js';
import LayoutRepository from '../../../../infrastructure/repositories/chit/super/layoutSettingRepository.js';
import LayoutSettingUseCase from '../../../../usecases/auth/chit/admin/layoutSettingUseCase.js';
import TokenService from '../../../../utils/jwtToken.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';



const router = express.Router()

const layoutRepository =new LayoutRepository()
const layoutUseCase = new LayoutSettingUseCase(layoutRepository)
const tokenService =new TokenService()
const authMiddleware = new AuthMiddleware(tokenService)

const layoutController = new LayoutSettingController(layoutUseCase)

/**
 * @swagger
 * tags:
 *   name: AdminLayout
 *   description: System-wide layout and theme configuration
 */

router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/admin/layoutsetting:
 *   post:
 *     summary: Add or update layout setting
 *     tags: [AdminLayout]
 *     security:
 *       - bearerAuth: []
 */
router.post('/',(req,res)=>layoutController.addSetting(req,res));

/**
 * @swagger
 * /api/admin/layoutsetting/color:
 *   patch:
 *     summary: Update layout color theme
 *     tags: [AdminLayout]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/color',(req,res)=>layoutController.updateLayoutColor(req,res));

/**
 * @swagger
 * /api/admin/layoutsetting/project/{projectId}/branch/{branchId}:
 *   get:
 *     summary: Get layout by project and branch
 *     tags: [AdminLayout]
 *     security:
 *       - bearerAuth: []
 */
router.get('/project/:projectId/branch/:branchId',(req,res)=>layoutController.getByProjectAndBranch(req,res))

/**
 * @swagger
 * /api/admin/layoutsetting/branch/{branchId}:
 *   get:
 *     summary: Get layout by branch
 *     tags: [AdminLayout]
 *     security:
 *       - bearerAuth: []
 */
router.get('/branch/:branchId',(req,res)=>layoutController.getByBranch(req,res));


export default router;