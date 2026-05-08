import express from 'express';
import UseAccessController from '../../../controllers/chit/admin/client/useAccessController.js';
import UserAccessUseCase from '../../../../usecases/auth/chit/client/userAccessUseCase.js';
import UserAccessRepository from '../../../../infrastructure/repositories/chit/userAccessRepository.js';
import SubMenuRepository from '../../../../infrastructure/repositories/chit/subMenuRepository.js';
import MenuRepository from '../../../../infrastructure/repositories/chit/MenuRepository.js';
import TokenService from '../../../../utils/jwtToken.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';


const router = express.Router()
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

const useraccessRepository = new UserAccessRepository();
const submenuRepository = new SubMenuRepository()
const menuRepository = new MenuRepository()
const useraccessUseCase = new UserAccessUseCase(useraccessRepository,submenuRepository,menuRepository);

const useraccessContoller = new UseAccessController(useraccessUseCase)

/**
 * @swagger
 * tags:
 *   name: UserAccess
 *   description: Management of menu permissions and user access control
 */

router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/client/useraccess/{roleId}:
 *   patch:
 *     summary: Update menu permissions for a role
 *     tags: [UserAccess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 */
router.patch('/:roleId',(req,res)=>useraccessContoller.updateMenuPermission(req,res));

/**
 * @swagger
 * /api/client/useraccess/permissions/{roleId}:
 *   get:
 *     summary: Get user permissions by role ID
 *     tags: [UserAccess]
 *     security:
 *       - bearerAuth: []
 */
router.get('/permissions/:roleId',(req,res)=>useraccessContoller.getUserPrermission(req,res));

/**
 * @swagger
 * /api/client/useraccess/menu/{roleId}:
 *   get:
 *     summary: Get active menu access for a role
 *     tags: [UserAccess]
 *     security:
 *       - bearerAuth: []
 */
router.get('/menu/:roleId',(req,res)=>useraccessContoller.getActiveMenuAccess(req,res))



export default router;