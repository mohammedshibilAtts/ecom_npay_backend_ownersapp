import express from 'express';
import GiftIssuesController from '../../../controllers/chit/admin/client/giftIssuesController.js';
import GiftIssuesUseCase from '../../../../usecases/auth/chit/client/giftIssuesUseCase.js';
import GiftIssuesRepository from '../../../../infrastructure/repositories/chit/giftIssuesRepository.js';
import SchemeAccountRepository from '../../../../infrastructure/repositories/chit/schemeAccountRepository.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/giftValidator.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
import GiftInwardsRepo from '../../../../infrastructure/repositories//chit/giftInwardsRepository.js'
import giftItemRepository from '../../../../infrastructure/repositories/chit/giftItemRepository.js';
import CustomerRepository from '../../../../infrastructure/repositories/chit/CustomerRepository.js';

const router= express.Router();
const tokenService= new TokenService();
const validator = new Validator()
const authMiddleware= new AuthMiddleware(tokenService);

const giftIssuesRepository= new GiftIssuesRepository();
const giftInwardsRepo = new GiftInwardsRepo()
const giftItemRepo = new giftItemRepository()
const schemeAccountRepository= new SchemeAccountRepository();
const customerRepository = new CustomerRepository()
const giftIssuesUseCase= new GiftIssuesUseCase(giftIssuesRepository,giftInwardsRepo,giftItemRepo,schemeAccountRepository,customerRepository);

const giftIssuesController= new GiftIssuesController(giftIssuesUseCase,validator)

/**
 * @swagger
 * tags:
 *   name: GiftIssue
 *   description: Issuing gift items to customers based on scheme completion
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/giftissue:
 *   post:
 *     summary: Issue a new gift to a customer
 *     tags: [GiftIssue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Gift issued
 *   get:
 *     summary: Get all active gift issues
 *     tags: [GiftIssue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of issues
 */
router.post('/',(req,res)=>giftIssuesController.addGiftIssue(req,res));

/**
 * @swagger
 * /api/client/giftissue/{id}:
 *   delete:
 *     summary: Delete a gift issue record
 *     tags: [GiftIssue]
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
 *         description: Issue record deleted
 *   get:
 *     summary: Get gift issue by ID
 *     tags: [GiftIssue]
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
 *         description: Issue details
 */
router.delete('/:id',(req,res)=>giftIssuesController.deleteGiftIssue(req,res));
router.get('/:id',(req,res)=>giftIssuesController.getGiftIssueById(req,res));

/**
 * @swagger
 * /api/client/giftissue/branch/{branchId}:
 *   get:
 *     summary: Get gift issues by branch ID
 *     tags: [GiftIssue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of issues
 */
router.get('/branch/:branchId',(req,res)=>giftIssuesController.getGiftIssuesByBranch(req,res));
router.get('/',(req,res)=>giftIssuesController.getAllActiveIssues(req,res));

/**
 * @swagger
 * /api/client/giftissue/branch/{id}/barcode:
 *   post:
 *     summary: Search gift by barcode in branch
 *     tags: [GiftIssue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Barcode details
 */
router.post('/branch/:id/barcode',(req,res)=>giftIssuesController.searchBarcode(req,res));

/**
 * @swagger
 * /api/client/giftissue/table:
 *   post:
 *     summary: Get gift issues table data
 *     tags: [GiftIssue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Table data
 */
router.post('/table',(req,res)=>giftIssuesController.giftIssuesDataTable(req,res))

/**
 * @swagger
 * /api/client/giftissue/branch/{branchId}/count:
 *   get:
 *     summary: Get counts of gift issues for branch
 *     tags: [GiftIssue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Counts data
 */
router.get('/branch/:branchId/count',(req,res)=>giftIssuesController.giftAccounntCount(req,res))

/**
 * @swagger
 * /api/client/giftissue/cards:
 *   post:
 *     summary: Get gift cards overview data
 *     tags: [GiftIssue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview data
 */
router.post('/cards',(req,res)=>giftIssuesController.getCardsData(req,res))

/**
 * @swagger
 * /api/client/giftissue/schemeaccount/{value}:
 *   post:
 *     summary: Get gift issue data by scheme account ID
 *     tags: [GiftIssue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Issue data
 */
router.post('/schemeaccount/:value',(req,res)=>giftIssuesController.giftIssueDataByschemeaccId(req,res))

export default router;