import express from 'express';
import AuthController from '../../../controllers/chit/admin/AuthController.js';
import MongoUserRepository from '../../../../infrastructure/repositories/chit/MongoUserRepository.js';
import HashingService from '../../../../utils/bcrypt.js';
import TokenService from '../../../../utils/jwtToken.js';
import LoginUsecase from '../../../../usecases/auth/chit/admin/LoginUseCase.js'
import LayoutRepository from '../../../../infrastructure/repositories/chit/super/layoutSettingRepository.js';
import UserAccessRepository from '../../../../infrastructure/repositories/chit/userAccessRepository.js';
import EmployeeRepository from '../../../../infrastructure/repositories/chit/EmployeeRepository.js';

const router = express.Router();
const hashingService= new HashingService();
const tokenService= new TokenService ();
const userRepository = new MongoUserRepository();
const layoutRepository = new LayoutRepository()
const userAccessRepo = new UserAccessRepository()
const employeeRepo = new EmployeeRepository ()
const loginUseCase=new LoginUsecase(userRepository,hashingService,tokenService,layoutRepository,userAccessRepo,employeeRepo);

const authController = new AuthController(loginUseCase);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Admin authentication
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', (req, res) => authController.login(req, res));

export default router; 