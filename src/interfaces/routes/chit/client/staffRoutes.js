import express from 'express';
import StaffUserController from '../../../controllers/chit/admin/client/staffuserController.js';
import StaffRepository from '../../../../infrastructure/repositories/chit/StaffUserRepository.js';
import StaffUseCase from '../../../../usecases/auth/chit/client/StaffUseCase.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/validation.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
import HashingService from '../../../../utils/bcrypt.js';

const router= express.Router();
const tokenService= new TokenService();
const hashingService= new HashingService();
const validator = new Validator()
const authMiddleware= new AuthMiddleware(tokenService)



const staffRepository= new StaffRepository();
const staffUseCase= new StaffUseCase(staffRepository,hashingService);

const staffController= new StaffUserController(staffUseCase,validator);

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Management of staff user accounts and permissions
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/staff/table:
 *   post:
 *     summary: Get staff table data
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.post('/table',(req,res)=>staffController.getAllStaffs(req,res));

/**
 * @swagger
 * /api/client/staff:
 *   post:
 *     summary: Add a new staff user
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.post('/',(req,res)=>staffController.addStaff(req,res));

/**
 * @swagger
 * /api/client/staff/{id}:
 *   get:
 *     summary: Get staff user by ID
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Edit staff user details
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a staff user
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id',(req,res)=>staffController.editStaff(req,res));
router.delete('/:id',(req,res)=>staffController.deleteStaff(req,res));

/**
 * @swagger
 * /api/client/staff/{id}/active:
 *   patch:
 *     summary: Toggle staff active status
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',(req,res)=>staffController.toggleStaffStatus(req,res));
router.get('/:id',(req,res)=>staffController.getStaffById(req,res))

export default router;