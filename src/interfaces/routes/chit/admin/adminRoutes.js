import express from 'express';
import AdminController from '../../../controllers/chit/admin/AdminController.js';
import AdminRepository from "../../../../infrastructure/repositories/chit/AdminRepository.js"
import AdminUseCase from "../../../../usecases/auth/chit/admin/AdminUseCase.js";
import TokenService from '../../../../utils/jwtToken.js';
import HashingService from '../../../../utils/bcrypt.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js'
import notificationRoutes from './notificatonSettinRoutes.js';
import smssettingRoutes from './smsSettingRoutes.js'
import s3bucketRoutes from './s3bucketRoustes.js';
import layoutSettingRoutes from './layoutSettingRoutes.js'

const router = express.Router();
const hashingService= new HashingService();
const tokenService= new TokenService();
const authMiddleware= new AuthMiddleware(tokenService)
const adminRepository = new AdminRepository();
const adminUseCase= new AdminUseCase(adminRepository,hashingService,tokenService);

const adminController = new AdminController(adminUseCase);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: System administrator management
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login (alternative)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', (req, res) => adminController.login(req, res));

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created
 */
router.post('/register',(req,res)=>adminController.addNewAdmin(req,res));

/**
 * @swagger
 * /api/admin/{id}:
 *   patch:
 *     summary: Change admin active state
 *     tags: [Admin]
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
 *         description: State updated
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admin]
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
 *         description: Admin deleted
 */
router.patch('/:id',(req,res)=>adminController.changeActiveState(req,res));
router.delete('/:id',(req,res)=> adminController.deleteAdmin(req,res));

router.use('/notificationsetting',notificationRoutes);
router.use('/smssetting',smssettingRoutes)
router.use('/bucketsetting',s3bucketRoutes);
router.use('/layoutsetting',layoutSettingRoutes)


export default router;