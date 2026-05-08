import ClassificationUseCase from '../../../../usecases/auth/chit/client/ClassificationUseCase.js';
import ClassificationController from '../../../controllers/chit/admin/client/classificationController.js';
import Validator from '../../../../utils/validations/validation.js';
import ClassificationRepository from '../../../../infrastructure/repositories/chit/ClassificationRepository.js';
import S3Service from '../../../../utils/s3Bucket.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';
import TokenService from '../../../../utils/jwtToken.js';
import {upload} from '../../../../utils/multer.js';
import S3BucketRepository from '../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js';
import express from 'express';

const router = express.Router();

const validator = new Validator();
const s3service= new S3Service();
const tokenService= new TokenService();
const authMiddleware= new AuthMiddleware(tokenService);
const s3Repo = new S3BucketRepository()

const classificationRepository= new ClassificationRepository();
const classificationUseCase= new ClassificationUseCase(classificationRepository,s3service,s3Repo);

const classificationController= new ClassificationController(classificationUseCase,validator)

//scheme classification
/**
 * @swagger
 * tags:
 *   name: Classification
 *   description: Category and type classification management with images
 */

/**
 * @swagger
 * /api/client/classification:
 *   get:
 *     summary: Get all active classifications
 *     tags: [Classification]
 *   post:
 *     summary: Add new classification (with image)
 *     tags: [Classification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/scheme',(req,res)=>classificationController.getSchemeClassification(req,res))
router.get('/',(req,res)=>classificationController.getAllActiveClassifications(req,res))

/**
 * @swagger
 * /api/client/classification/{id}:
 *   get:
 *     summary: Get classification by ID
 *     tags: [Classification]
 *   patch:
 *     summary: Update classification
 *     tags: [Classification]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete classification
 *     tags: [Classification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id',(req,res)=>classificationController.getClassificationById(req,res));
router.use(authMiddleware.protect);
router.post('/',upload.handleUpload([
    { name: 'classifcationImg', maxCount: 1 },
  ]),(req,res)=>classificationController.addSchemeClassification(req,res));
router.patch('/:id',upload.handleUpload([
    { name: 'classifcationImg', maxCount: 1 },
  ]),(req,res)=>classificationController.updateClassification(req,res));
router.delete('/:id',(req,res)=>classificationController.deleteClassification(req,res));

/**
 * @swagger
 * /api/client/classification/{id}/active:
 *   patch:
 *     summary: Toggle classification status
 *     tags: [Classification]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',(req,res)=>classificationController.toggleActiveStatus(req,res));

export default router;