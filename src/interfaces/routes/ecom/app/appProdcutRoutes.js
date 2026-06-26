import express from "express";
import ProductController from "../../../controllers/ecom/app/appProductController.js";
import ProductRepository from "../../../../infrastructure/repositories/chit/productRepository.js";
import AppProductUsecase from "../../../../usecases/ecom/app/appProductUsecase.js";
import S3Service from "../../../../utils/s3Bucket.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";
import TokenService from "../../../../utils/jwtToken.js";
import ProductValidator from "../../../../utils/validations/productValidator.js";
import BranchRepository from "../../../../infrastructure/repositories/chit/brachRepository.js";
import MetalRepository from "../../../../infrastructure/repositories/chit/MetalRepository.js";
import CategoryRepository from "../../../../infrastructure/repositories/chit/categoryRepository.js";
import purityReporsitory from "../../../../infrastructure/repositories/chit/purityReporsitory.js";
import MetalRateRepository from "../../../../infrastructure/repositories/chit/metalRateRepository.js";
import S3BucketRepository from "../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js";
import SubcategoryRepository from "../../../../infrastructure/repositories/ecom/subcategoryRepositary.js";
import ItemRepository from "../../../../infrastructure/repositories/ecom/itemRepository.js";
import WishlistRepository from "../../../../infrastructure/repositories/chit/wishlistRepository.js";

const router = express.Router();

const validator = new ProductValidator();
const tokenService = new TokenService();
const s3Service = new S3Service();
const productRepository = new ProductRepository();
const brachRepository = new BranchRepository();
const metalRepository = new MetalRepository();
const categoryRepository = new CategoryRepository();
const purityRepository = new purityReporsitory();
const metalRateRepository = new MetalRateRepository();
const s3Repo = new S3BucketRepository();
const subCategoryRepository = new SubcategoryRepository();
const itemRepository = new ItemRepository();
const wishlistRepository = new WishlistRepository();
const authMiddleware = new AuthMiddleware(tokenService);

const usecase = new AppProductUsecase(
  productRepository,
  brachRepository,
  metalRepository,
  categoryRepository,
  purityRepository,
  metalRateRepository,
  s3Service,
  s3Repo,
  subCategoryRepository,
  itemRepository,
  wishlistRepository
);

const controller = new ProductController(usecase);

router.use(authMiddleware.bypassProtect);
router.get("/available-sizes", (req, res) =>
  controller.getAvailableSizes(req, res),
);
router.get("/items", (req, res) => controller.getItemsByCriteria(req, res));
router.get("/subcategory/:id", (req, res) =>
  controller.getProductBySubcategory(req, res),
);
router.get("/category/:id", (req, res) =>
  controller.getProductByCategory(req, res),
);
router.get("/category/:id/filters", (req, res) =>
  controller.getCategoryFilters(req, res),
);
router.get("/:id", (req, res) => controller.ProductById(req, res));

export default router;
