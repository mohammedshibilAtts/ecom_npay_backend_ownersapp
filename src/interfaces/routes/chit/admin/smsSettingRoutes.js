import express from 'express';
import SmsSettingController from '../../../controllers/chit/admin/super/smsSettingController.js';
import SmsSettingRepository from '../../../../infrastructure/repositories/chit/super/smsSettingRepository.js';
import SmsSettingUseCase from '../../../../usecases/auth/chit/admin/smsSettingUseCase.js';
import TokenService from '../../../../utils/jwtToken.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';



const router = express.Router()

const smssettingRepository =new SmsSettingRepository()
const smssettingUseCase = new SmsSettingUseCase(smssettingRepository)
const tokenService =new TokenService()
const authMiddleware = new AuthMiddleware(tokenService)

const smssettingController = new SmsSettingController(smssettingUseCase)

/**
 * @swagger
 * tags:
 *   name: AdminSMS
 *   description: SMS gateway provider configuration
 */

router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/admin/smssetting:
 *   post:
 *     summary: Add or update SMS gateway setting
 *     tags: [AdminSMS]
 *     security:
 *       - bearerAuth: []
 */
router.post('/',(req,res)=>smssettingController.addSmsSetting(req,res));

/**
 * @swagger
 * /api/admin/smssetting/project/{projectId}/branch/{branchId}:
 *   get:
 *     summary: Get SMS setting by project and branch
 *     tags: [AdminSMS]
 *     security:
 *       - bearerAuth: []
 */
router.get('/project/:projectId/branch/:branchId',(req,res)=>smssettingController.getByProjectAndBranch(req,res))
// router.get('/branch/:branchId',(req,res)=>smssettingController.getByBranch(req,res));


export default router;