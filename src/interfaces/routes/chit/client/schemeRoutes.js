import express from 'express';
import SchemeController from '../../../controllers/chit/admin/client/schemeController.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/validation.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
import SchemeUseCase from '../../../../usecases/auth/chit/client/SchemeUseCase.js';
import SchemeRepository from '../../../../infrastructure/repositories/chit/schemeRepository.js';
import MetalRepository from '../../../../infrastructure/repositories/chit/MetalRepository.js';
import PurityRespository from '../../../../infrastructure/repositories/chit/purityReporsitory.js'
import { upload } from "../../../../utils/multer.js";
import S3Service from '../../../../utils/s3Bucket.js';
import S3BucketRepository from '../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js';

const router= express.Router();

const tokenService= new TokenService();
const validator = new Validator()
const authMiddleware= new AuthMiddleware(tokenService)


const schemeRepository= new SchemeRepository()
const metalRepository = new MetalRepository();
const purityRepository = new PurityRespository()
const s3Repo = new S3BucketRepository()
const s3Service=new S3Service()
const schemeUseCase= new SchemeUseCase(schemeRepository,metalRepository,purityRepository,
    s3Repo,s3Service
);

const schemeController= new SchemeController(schemeUseCase,validator);

/**
 * @swagger
 * tags:
 *   name: Scheme
 *   description: Chit scheme management
 */

/**
 * @swagger
 * /api/client/scheme:
 *   get:
 *     summary: Get all active schemes
 *     tags: [Scheme]
 *     responses:
 *       200:
 *         description: List of active schemes
 *   post:
 *     summary: Add a new scheme
 *     tags: [Scheme]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *               desc_img:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Scheme created
 */
router.get('/',(req,res)=>schemeController.getAllActiveSchemes(req,res))

/**
 * @swagger
 * /api/client/scheme/classification:
 *   get:
 *     summary: Get schemes by classification
 *     tags: [Scheme]
 *     responses:
 *       200:
 *         description: List of schemes
 */
router.get('/classification', (req, res) => schemeController.getSchemeByclassificationId(req, res));

/**
 * @swagger
 * /api/client/scheme/digigold:
 *   get:
 *     summary: Get DigiGold static data
 *     tags: [Scheme]
 *     responses:
 *       200:
 *         description: Static data retrieved
 */
router.get('/digigold',(req,res)=>schemeController.getDigigoldStaticData(req,res))

/**
 * @swagger
 * /api/client/scheme/{id}:
 *   get:
 *     summary: Get scheme by ID
 *     tags: [Scheme]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheme details
 *   patch:
 *     summary: Update a scheme
 *     tags: [Scheme]
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
 *         description: Scheme updated
 *   delete:
 *     summary: Delete a scheme
 *     tags: [Scheme]
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
 *         description: Scheme deleted
 */
router.get('/:id',(req,res)=>schemeController.getSchemeById(req,res));

/**
 * @swagger
 * /api/client/scheme/branch/{branchId}:
 *   get:
 *     summary: Get schemes by branch ID
 *     tags: [Scheme]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of schemes
 */
router.get('/branch/:branchId',(req,res)=>schemeController.getSchemeByBrachId(req,res));

/**
 * @swagger
 * /api/client/scheme/digigold/{type}:
 *   get:
 *     summary: Get DigiGold schemes by type
 *     tags: [Scheme]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of DigiGold schemes
 */
router.get('/digigold/:type',(req,res)=>schemeController.getDigiGoldSchemes(req,res))

router.use(authMiddleware.protect);
router.post('/',upload.handleUpload([{name:"logo",maxCount:1},{name:"desc_img",maxCount:1}]),(req,res)=>schemeController.addScheme(req,res));

/**
 * @swagger
 * /api/client/scheme/table:
 *   post:
 *     summary: Get schemes table data (paginated)
 *     tags: [Scheme]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Table data
 */
router.post('/table',(req,res)=>schemeController.schemesTableData(req,res));
router.patch('/:id',upload.handleUpload([{name:"logo",maxCount:1},{name:"desc_img",maxCount:1}]),(req,res)=>schemeController.updateScheme(req,res));
router.delete('/:id',(req,res)=>schemeController.deleteScheme(req,res));

/**
 * @swagger
 * /api/client/scheme/{id}/active:
 *   patch:
 *     summary: Toggle scheme status
 *     tags: [Scheme]
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
 *         description: Status toggled
 */
router.patch('/:id/active',(req,res)=>schemeController.toggleSchemeStatus(req,res));

/**
 * @swagger
 * /api/client/scheme/delist:
 *   post:
 *     summary: Get delisted schemes
 *     tags: [Scheme]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of delisted schemes
 */
router.post('/delist',(req,res)=>schemeController.getDelistSchemes(req,res));

router.post('/branch/:branchId', (req, res) => schemeController.getAllBranchScheme(req, res));

// for order change 

router.post('/change-order',(req,res)=>schemeController.changeOrder(req,res));

export default router;