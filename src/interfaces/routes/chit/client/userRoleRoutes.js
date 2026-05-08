import express from 'express';
import UserRoleRepository from '../../../../infrastructure/repositories/chit/userRoleRepository.js';
import UserRoleUseCase from '../../../../usecases/auth/chit/client/userRoleUseCases.js';
import UserRoleController from '../../../controllers/chit/admin/client/useRoleController.js';
import TokenService from '../../../../utils/jwtToken.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';


const router = express.Router();
const tokenService = new TokenService()
const authMiddleware=new  AuthMiddleware(tokenService)

const userRoleRepository = new UserRoleRepository();
const userRoleUseCase = new UserRoleUseCase(userRoleRepository)

const userRoleController = new UserRoleController(userRoleUseCase);

/**
 * @swagger
 * tags:
 *   name: UserRole
 *   description: Management of user roles and hierarchy
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/userrole:
 *   get:
 *     summary: Get all active user roles
 *     tags: [UserRole]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Add a new user role
 *     tags: [UserRole]
 *     security:
 *       - bearerAuth: []
 */
router.post('/',(req,res)=>userRoleController.addUserRole(req,res));

/**
 * @swagger
 * /api/client/userrole/{id}:
 *   get:
 *     summary: Get user role by ID
 *     tags: [UserRole]
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Update user role details
 *     tags: [UserRole]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a user role
 *     tags: [UserRole]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id',(req,res)=>userRoleController.updateUserRole(req,res));
router.delete("/:id",(req,res)=>userRoleController.deletedRole(req,res));

/**
 * @swagger
 * /api/client/userrole/{id}/active:
 *   patch:
 *     summary: Toggle user role active status
 *     tags: [UserRole]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',(req,res)=>userRoleController.activateUserRole(req,res));
router.get('/:id',(req,res)=>userRoleController.getUserRoleById(req,res));

/**
 * @swagger
 * /api/client/userrole/table:
 *   post:
 *     summary: Get user roles table data
 *     tags: [UserRole]
 *     security:
 *       - bearerAuth: []
 */
router.post('/table',(req,res)=>userRoleController.getUserRolesTable(req,res));
router.get('/',(req,res)=>userRoleController.getAllUserRoles(req,res));

export default router;