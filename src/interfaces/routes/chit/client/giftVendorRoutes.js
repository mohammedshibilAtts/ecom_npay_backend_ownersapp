import express from 'express';
import giftVendorUseCase from '../../../../usecases/auth/chit/client/giftVendorUseCase.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/giftValidator.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
import giftVendorRepository from '../../../../infrastructure/repositories/chit/giftVendorRepository.js';
import giftVendorController from '../../../controllers/chit/admin/client/giftVendorController.js';
const router = express.Router();

const tokenService= new TokenService();
const validator = new Validator()
const authMiddleware= new AuthMiddleware(tokenService);

const giftVendorRepositroy= new giftVendorRepository();
const giftvendorUseCase= new giftVendorUseCase(giftVendorRepositroy);

const giftvendorController= new giftVendorController(giftvendorUseCase,validator)


/**
 * @swagger
 * tags:
 *   name: GiftVendor
 *   description: Management of gift item vendors
 */

/**
 * @swagger
 * /api/client/giftvendor/table:
 *   post:
 *     summary: Get list of gift vendors for table
 *     tags: [GiftVendor]
 *     responses:
 *       200:
 *         description: Table data
 */
router.post('/table',(req,res)=>giftvendorController.allVendorsDataTable(req,res));

/**
 * @swagger
 * /api/client/giftvendor:
 *   get:
 *     summary: Get all active gift vendors
 *     tags: [GiftVendor]
 *     responses:
 *       200:
 *         description: List of vendors
 *   post:
 *     summary: Add a new gift vendor
 *     tags: [GiftVendor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Vendor created
 */
router.get('/',(req,res)=>giftvendorController.getAllActiveVendors(req,res));

/**
 * @swagger
 * /api/client/giftvendor/branch/{id}:
 *   get:
 *     summary: Get gift vendors by branch ID
 *     tags: [GiftVendor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of vendors
 */
router.get('/branch/:id',(req,res)=>giftvendorController.getGiftVendorByBranch(req,res));

/**
 * @swagger
 * /api/client/giftvendor/{id}:
 *   get:
 *     summary: Get gift vendor by ID
 *     tags: [GiftVendor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor details
 *   patch:
 *     summary: Edit gift vendor
 *     tags: [GiftVendor]
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
 *         description: Vendor updated
 *   delete:
 *     summary: Delete gift vendor
 *     tags: [GiftVendor]
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
 *         description: Vendor deleted
 */
router.get('/:id',(req,res)=>giftvendorController.getGiftItemById(req,res));
router.use(authMiddleware.protect);
router.post('/',(req,res)=>giftvendorController.addGiftVendor(req,res));
router.patch('/:id',(req,res)=>giftvendorController.editGiftVendor(req,res));

/**
 * @swagger
 * /api/client/giftvendor/{id}/active:
 *   patch:
 *     summary: Toggle vendor active status
 *     tags: [GiftVendor]
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
router.patch('/:id/active',(req,res)=>giftvendorController.changeVendorActiveState(req,res));
router.delete('/:id',(req,res)=>giftvendorController.deleteVendor(req,res));

export default router;