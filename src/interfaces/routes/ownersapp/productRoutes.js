import express from 'express';
import ProductController from '../../controllers/ownersapp/productController.js';
import ProductUseCase from '../../../usecases/ownersapp/productUseCase.js';
import ActualProductUseCase from '../../../usecases/auth/chit/client/productUseCase.js';
import ProductRepository from '../../../infrastructure/repositories/chit/productRepository.js';
import BranchRepository from '../../../infrastructure/repositories/chit/brachRepository.js';
import MetalRepository from '../../../infrastructure/repositories/chit/MetalRepository.js';
import CategoryRepository from '../../../infrastructure/repositories/chit/categoryRepository.js';
import PurityRepository from '../../../infrastructure/repositories/chit/purityReporsitory.js';
import MetalRateRepository from '../../../infrastructure/repositories/chit/metalRateRepository.js';
import S3Service from '../../../utils/s3Bucket.js';
import S3BucketRepository from '../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js';
import SubcategoryRepository from '../../../infrastructure/repositories/ecom/subcategoryRepositary.js';
import ItemRepository from '../../../infrastructure/repositories/ecom/itemRepository.js';
import StoneDetailsRepository from '../../../infrastructure/repositories/ecom/stoneDetailsRepository.js';
import ItemUseCase from '../../../usecases/ownersapp/itemUsecase.js';
import ProductValidator from '../../../utils/validations/productValidator.js';
import { upload } from "../../../utils/multer.js";

const productRepository = new ProductRepository();
const branchRepository = new BranchRepository();
const metalRepository = new MetalRepository();
const categoryRepository = new CategoryRepository();
const purityRepository = new PurityRepository();
const metalRateRepository = new MetalRateRepository();
const s3Service = new S3Service();
const s3Repo = new S3BucketRepository();
const subCategoryRepository = new SubcategoryRepository();
const itemRepository = new ItemRepository();
const stoneDetailsRepository = new StoneDetailsRepository();
const validator = new ProductValidator();

const actualProductUseCase = new ActualProductUseCase(
  productRepository,
  branchRepository,
  metalRepository,
  categoryRepository,
  purityRepository,
  metalRateRepository,
  s3Service,
  s3Repo,
  subCategoryRepository
);

const itemUseCase = new ItemUseCase(itemRepository, productRepository, stoneDetailsRepository);
const productUseCase = new ProductUseCase(actualProductUseCase, itemUseCase);
const controller = new ProductController(productUseCase, validator);

const router = express.Router();

router.post('/table', (req, res) => controller.allProducts(req, res));
router.get('/:id', (req, res) => controller.getProductById(req, res));
router.post('/', upload.handleUpload(), (req, res) => controller.addProduct(req, res));
router.patch('/:id', upload.handleUpload(), (req, res) => controller.editProduct(req, res));
router.patch('/:id/active', (req, res) => controller.changeStatus(req, res));
router.patch('/:id/toggle-sold', (req, res) => controller.toggleSoldStatus(req, res));
router.patch('/best-seller/:id', (req, res) => controller.toggleBestSeller(req, res));

export default router;
