import express from "express";

import CategoryRepository from "../../../../infrastructure/repositories/chit/categoryRepository.js";
import CategoryUseCase from "../../../../usecases/auth/chit/client/CategoryUsecase.js";
import CategoryController from "../../../controllers/chit/admin/client/categoryController.js";
import CategoryValidator from "../../../../utils/validations/categoryValidation.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";
import TokenService from "../../../../utils/jwtToken.js";
import BranchRepository from "../../../../infrastructure/repositories/chit/brachRepository.js";
import { upload } from "../../../../utils/multer.js";
import S3Service from "../../../../utils/s3Bucket.js";
import S3BucketRepository from "../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js";


const branchRepository = new BranchRepository()
const repository = new CategoryRepository();
const s3Repo = new S3BucketRepository();
const s3Service = new S3Service();
const useCase = new CategoryUseCase(repository,branchRepository,s3Repo,s3Service);
const validator = new CategoryValidator();
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

const controller = new CategoryController(useCase, validator);

const router = express.Router();

router.get('/allcategories',(req,res)=>controller.getAllCategoriesWithoutBranch(req,res));
/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Product category management
 */

/**
 * @swagger
 * /api/client/category/all:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 */
router.get('/all',(req,res)=>controller.getAllCategories(req,res))

/**
 * @swagger
 * /api/client/category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Category]
 *   patch:
 *     summary: Edit category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", (req, res) => controller.getById(req, res));
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/category:
 *   get:
 *     summary: Get all active categories
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Add new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 */
router.get('/',(req,res)=>controller.getAllActiveCategory(req,res))

/**
 * @swagger
 * /api/client/category/table:
 *   post:
 *     summary: Get categories table data
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 */
router.post('/table',(req,res)=>controller.getCategory(req,res))

/**
 * @swagger
 * /api/client/category/branch/{id}:
 *   get:
 *     summary: Get categories by branch ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 */
router.get("/branch/:id", (req, res) => controller.getByBranchId(req, res));

/**
 * @swagger
 * /api/client/category/metal/{id}:
 *   get:
 *     summary: Get categories by metal ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 */
router.get("/metal/:id", (req, res) => controller.getByMetalId(req, res));
router.post("/",upload.handleUpload([{name:"image",maxCount:1},{name:"categoryBanner",maxCount:1}]), (req, res) => controller.addCategory(req, res));
router.patch("/:id",upload.handleUpload([{name:"image",maxCount:1},{name:"categoryBanner",maxCount:1}]), (req, res) => controller.editCategory(req, res));
router.patch("/:id/active", (req, res) => controller.changeStatus(req, res));
router.delete("/:id", (req, res) => controller.deleteCategory(req, res));


export default router;
