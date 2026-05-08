import express from 'express';
import DepartmentController from '../../../controllers/chit/admin/client/departmentController.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/validation.js';
import S3Service from '../../../../utils/s3Bucket.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
import {upload} from '../../../../utils/multer.js';
import HashingService from '../../../../utils/bcrypt.js';
import DepartmentRepository from '../../../../infrastructure/repositories/chit/departmentRepository.js';
import DepartmentUseCase from '../../../../usecases/auth/chit/client/departmentUseCase.js';

const router = express.Router();

const tokenService= new TokenService();
const hashingService= new HashingService();
const validator = new Validator()
const s3service= new S3Service();
const authMiddleware= new AuthMiddleware(tokenService);

const departmentRepository= new DepartmentRepository()
const departmentUseCase= new DepartmentUseCase(departmentRepository);

const departmentController= new DepartmentController(departmentUseCase,validator);

/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Internal organizational departments management
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/department/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id',(req,res)=>departmentController.getDepartmentByid(req,res));

/**
 * @swagger
 * /api/client/department/table:
 *   post:
 *     summary: Get departments table data
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 */
router.post('/table',(req,res)=>departmentController.departmentTable(req,res));

/**
 * @swagger
 * /api/client/department:
 *   get:
 *     summary: Get all active departments
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Add new department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 */
router.get('/',(req,res)=>departmentController.getAllActiveDepartments(req,res));
router.post('/',(req,res)=>departmentController.addDepartment(req,res));

/**
 * @swagger
 * /api/client/department/{id}:
 *   patch:
 *     summary: Edit department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id',(req,res)=>departmentController.editDepartment(req,res));
router.delete('/:id',(req,res)=>departmentController.deleteDepartment(req,res));

/**
 * @swagger
 * /api/client/department/{id}/active:
 *   patch:
 *     summary: Toggle department active status
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',(req,res)=>departmentController.changeDepartmentStatus(req,res));

export default router;