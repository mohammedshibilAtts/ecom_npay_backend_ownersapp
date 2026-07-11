import express from 'express';

import faqController from '../../../controllers/chit/admin/client/faqController.js';
import faqRepo from '../../../../infrastructure/repositories/chit/faqRepo.js';
import faqUseCase from '../../../../usecases/auth/chit/client/faqUseCase.js';

import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";

const router = express.Router();

const faqRepos = new faqRepo();
const faqUseCases = new faqUseCase(faqRepos);
const faqControllers = new faqController(faqUseCases);
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

/**
 * @swagger
 * tags:
 *   name: FAQ
 *   description: Frequently Asked Questions management
 */
//web ecom route
router.get('/web/faqs', (req, res) => faqControllers.allFaqs(req, res));
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/faq/all:
 *   post:
 *     summary: Get all FAQs (with filters)
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 */
router.post('/add', (req, res) => faqControllers.createfaq(req, res));

/**
 * @swagger
 * /api/client/faq/{id}:
 *   get:
 *     summary: Get FAQ by ID
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete FAQ entry
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 */
router.post('/all/', (req, res) => faqControllers.getAllfaq(req, res));
router.get('/:id', (req, res) => faqControllers.getfaqByUser(req, res));

/**
 * @swagger
 * /api/client/faq/update/{id}:
 *   patch:
 *     summary: Update FAQ details
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/update/:id', (req, res) => faqControllers.updatefaq(req, res));
router.delete('/:id', (req, res) => faqControllers.deletefaq(req, res));

export default router;
