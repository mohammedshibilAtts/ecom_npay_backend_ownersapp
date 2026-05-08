import express from "express";
import EmployeeController from "../../../controllers/chit/admin/client/employeeController.js";
import EmployeeRepository from "../../../../infrastructure/repositories/chit/EmployeeRepository.js";
import BranchRepository from "../../../../infrastructure/repositories/chit/brachRepository.js";
import EmployeeUseCase from "../../../../usecases/auth/chit/client/employeeUseCase.js";
import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";
import Validator from "../../../../utils/validations/employeeValidations.js";
import S3Service from "../../../../utils/s3Bucket.js";
import { upload } from "../../../../utils/multer.js";
import S3BucketRepository from "../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js";

const router = express.Router();
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);
const validator = new Validator();
const s3service = new S3Service();

const employeeRepository = new EmployeeRepository();
const branchRepository= new BranchRepository()
const s3Repo = new S3BucketRepository();
const employeeUseCase = new EmployeeUseCase(employeeRepository, s3service,branchRepository,s3Repo);

const employeeController = new EmployeeController(employeeUseCase, validator);

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Management of organization employees and staff
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/employee/table:
 *   post:
 *     summary: Get employees table data
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 */
router.post('/table',(req,res)=>employeeController.getAllEmployees(req,res))

/**
 * @swagger
 * /api/client/employee:
 *   get:
 *     summary: Get all employees
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Add new employee with documents
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  upload.handleUpload([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  (req, res) => employeeController.addEmployee(req, res)
);

/**
 * @swagger
 * /api/client/employee/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Edit employee details
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id",
  upload.handleUpload([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  (req, res) => employeeController.editEmployee(req, res)
);

/**
 * @swagger
 * /api/client/employee/mobile:
 *   get:
 *     summary: Get employee by mobile number
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 */
router.get('/mobile',(req,res)=>employeeController.getEmployeeByMobile(req,res))

/**
 * @swagger
 * /api/client/employee/referral:
 *   get:
 *     summary: Get employee referrals
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 */
router.get('/referral',(req,res)=>employeeController.getReferrals(req,res))
router.delete("/:id",(req,res)=>employeeController.deleteEmployee(req,res));

/**
 * @swagger
 * /api/client/employee/{id}/active:
 *   patch:
 *     summary: Toggle employee active status
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',(req,res)=>employeeController.activateEmployee(req,res));
router.get('/:id',(req,res)=>employeeController.getEmployeeById(req,res));

/**
 * @swagger
 * /api/client/employee/branch/{branchId}:
 *   get:
 *     summary: Get employees by branch ID
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 */
router.get('/branch/:branchId',(req,res)=>employeeController.getEmployeeByBranch(req,res));
router.get('/',(req,res)=>employeeController.getAll(req,res))



export default router;
