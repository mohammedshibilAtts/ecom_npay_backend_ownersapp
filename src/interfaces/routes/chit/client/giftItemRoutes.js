import express from "express";
import giftItemCotroller from "../../../controllers/chit/admin/client/giftItemController.js";
import giftItemUseCase from "../../../../usecases/auth/chit/client/giftItemUseCase.js";
import GiftItemRepository from "../../../../infrastructure/repositories/chit/giftItemRepository.js";
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/giftValidator.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
import S3Service from '../../../../utils/s3Bucket.js';
import {upload} from '../../../../utils/multer.js';
import S3BucketRepository from "../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js";


const router = express.Router();

const tokenService= new TokenService();
const validator = new Validator()
const authMiddleware= new AuthMiddleware(tokenService)
const s3service= new S3Service();
const s3Repo = new S3BucketRepository()

const giftitemRepository= new GiftItemRepository();
const giftitemUseCase= new giftItemUseCase(giftitemRepository,s3service,s3Repo);

const giftItemController= new giftItemCotroller(giftitemUseCase,validator)

/**
 * @swagger
 * tags:
 *   name: GiftItem
 *   description: Management of gift items available for schemes
 */

/**
 * @swagger
 * /api/client/giftitem/table:
 *   post:
 *     summary: Get gift items table data
 *     tags: [GiftItem]
 *     responses:
 *       200:
 *         description: Table data
 */
router.post('/table',(req,res)=>giftItemController.getAllActiveGiftItems(req,res));

/**
 * @swagger
 * /api/client/giftitem/branch/{id}:
 *   get:
 *     summary: Get gift items by branch ID
 *     tags: [GiftItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of gift items
 */
router.get('/branch/:id',(req,res)=>giftItemController.getGiftItemByBranch(req,res));

/**
 * @swagger
 * /api/client/giftitem/vendor/{id}:
 *   get:
 *     summary: Get gift items by vendor ID
 *     tags: [GiftItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of gift items
 */
router.get('/vendor/:id',(req,res)=>giftItemController.getGiftItemByVendor(req,res));

/**
 * @swagger
 * /api/client/giftitem/{id}:
 *   get:
 *     summary: Get gift item by ID
 *     tags: [GiftItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gift item details
 *   patch:
 *     summary: Edit gift item
 *     tags: [GiftItem]
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
 *         description: Gift item updated
 *   delete:
 *     summary: Delete gift item
 *     tags: [GiftItem]
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
 *         description: Gift item deleted
 */
router.get('/:id',(req,res)=>giftItemController.getGiftItemById(req,res));
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/giftitem:
 *   post:
 *     summary: Add a new gift item
 *     tags: [GiftItem]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               gift_image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gift item created
 */
router.post('/',upload.handleUpload([{ name: 'gift_image', maxCount: 1 }]),(req,res)=>giftItemController.addGiftItem(req,res));
router.patch('/:id',upload.handleUpload([{ name: 'gift_image', maxCount: 1 }]),(req,res)=>giftItemController.editGiftItem(req,res));

/**
 * @swagger
 * /api/client/giftitem/{id}/active:
 *   patch:
 *     summary: Toggle gift item active status
 *     tags: [GiftItem]
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
 *         description: Status updated
 */
router.patch('/:id/active',(req,res)=>giftItemController.changeGiftItemActiveState(req,res));
router.delete('/:id',(req,res)=>giftItemController.deleteGift(req,res));

export default router;