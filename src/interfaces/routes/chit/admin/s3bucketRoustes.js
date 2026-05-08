import express from 'express';
import S3BucketController from '../../../controllers/chit/admin/super/s3bucketController.js';
import S3BucketRepository from '../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js';
import S3BucketUseCase from '../../../../usecases/auth/chit/admin/s3bucketUseCase.js';
import TokenService from '../../../../utils/jwtToken.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';

const router = express.Router();

const s3bucketRepository = new S3BucketRepository();
const s3bucketUseCase = new S3BucketUseCase(s3bucketRepository);
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);


const s3bucketController = new S3BucketController(s3bucketUseCase);

/**
 * @swagger
 * tags:
 *   name: AdminS3
 *   description: Cloud storage (S3) configuration management
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/admin/bucketsetting:
 *   post:
 *     summary: Add or update S3 bucket setting
 *     tags: [AdminS3]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', (req, res) => s3bucketController.addSetting(req, res));

/**
 * @swagger
 * /api/admin/bucketsetting/project/{projectId}/branch/{branchId}:
 *   get:
 *     summary: Get S3 setting by project and branch
 *     tags: [AdminS3]
 *     security:
 *       - bearerAuth: []
 */
router.get('/project/:projectId/branch/:branchId', (req, res) => s3bucketController.getByProjectAndBranch(req, res));

/**
 * @swagger
 * /api/admin/bucketsetting/branch/{branchId}:
 *   get:
 *     summary: Get S3 setting by branch
 *     tags: [AdminS3]
 *     security:
 *       - bearerAuth: []
 */
router.get('/branch/:branchId',(req,res)=>s3bucketController.getByBranch(req,res))

export default router;