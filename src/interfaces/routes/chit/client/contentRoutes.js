import express from 'express';

import ContentRepo from '../../../../infrastructure/repositories/chit/contentRepo.js';
import ContentManagementController from '../../../controllers/chit/admin/client/ContentController.js';
import ContentUseCase from '../../../../usecases/auth/chit/client/ContentUseCase.js';
import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";

const router = express.Router();

const contentRepo = new ContentRepo();
const contentUseCase = new ContentUseCase(contentRepo);
const contentController = new ContentManagementController(contentUseCase);
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

//ecom web routes
router.get('/web/:id', (req, res) => contentController.getContentsForWeb(req, res));
/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Dynamic content and CMS management
 */

/**
 * @swagger
 * /api/client/content/all/type/{id}:
 *   get:
 *     summary: Get content by type ID
 *     tags: [Content]
 */
router.get('/all/type/:id', (req, res) => contentController.getContentTypes(req, res));
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/content/add:
 *   post:
 *     summary: Create new content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 */
router.post('/add', (req, res) => contentController.createContent(req, res));

/**
 * @swagger
 * /api/client/content/all:
 *   get:
 *     summary: Get all content entries
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 */
router.get('/all', (req, res) => contentController.getAllContent(req, res));

/**
 * @swagger
 * /api/client/content/{id}:
 *   get:
 *     summary: Get content by ID
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete content entry
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', (req, res) => contentController.getContentById(req, res));

/**
 * @swagger
 * /api/client/content/update/{id}:
 *   patch:
 *     summary: Update content details
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/update/:id', (req, res) => contentController.updateContent(req, res));
router.delete('/:id', (req, res) => contentController.deleteContent(req, res));

export default router;
