import express from 'express';
import giftInwardsController from '../../../controllers/chit/admin/client/giftInwardsController.js';
import giftInwardsRepository from '../../../../infrastructure/repositories/chit/giftInwardsRepository.js';
import giftInwardsUseCase from '../../../../usecases/auth/chit/client/giftInwardsUseCase.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/giftValidator.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';

const router= express.Router();

const tokernService= new TokenService();
const validator= new Validator()
const authMiddleware= new AuthMiddleware(tokernService);

const giftinwardsRepository= new giftInwardsRepository();
const giftinwardsUseCase= new giftInwardsUseCase(giftinwardsRepository);

const giftinwardsController = new giftInwardsController(giftinwardsUseCase,validator);

/**
 * @swagger
 * tags:
 *   name: GiftInward
 *   description: Stock management for gift item inwards
 */

/**
 * @swagger
 * /api/client/giftinward/table:
 *   post:
 *     summary: Get gift inwards table data
 *     tags: [GiftInward]
 *     responses:
 *       200:
 *         description: Table data
 */
router.post('/table',(req,res)=>giftinwardsController.giftInwardsDataTable(req,res));
router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/client/giftinward:
 *   post:
 *     summary: Add new gift inward (stock entry)
 *     tags: [GiftInward]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Inward recorded
 */
router.post('/',(req,res)=>giftinwardsController.addGiftInward(req,res));

/**
 * @swagger
 * /api/client/giftinward/{id}:
 *   patch:
 *     summary: Edit gift inward
 *     tags: [GiftInward]
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
 *         description: Inward updated
 *   delete:
 *     summary: Delete gift inward
 *     tags: [GiftInward]
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
 *         description: Inward deleted
 *   get:
 *     summary: Get gift inward by ID
 *     tags: [GiftInward]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inward details
 */
router.patch('/:id',(req,res)=>giftinwardsController.editGiftInward(req,res));
router.delete('/:id',(req,res)=>giftinwardsController.deleteGiftInward(req,res));

/**
 * @swagger
 * /api/client/giftinward/{id}/active:
 *   patch:
 *     summary: Toggle inward active status
 *     tags: [GiftInward]
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
router.patch('/:id/active',(req,res)=>giftinwardsController.changeInwardsActiveStatus(req,res));
router.get('/:id',(req,res)=>giftinwardsController.getGiftInwardsById(req,res));

/**
 * @swagger
 * /api/client/giftinward/branch/{branchId}:
 *   get:
 *     summary: Get gift inwards by branch ID
 *     tags: [GiftInward]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of inwards
 */
router.get('/branch/:branchId',(req,res)=>giftinwardsController.getGiftInwardsByBranch(req,res));
// router.get('/all',(req,res)=>giftinwardsController.getAllActiveInwards(req,res))


export default router;