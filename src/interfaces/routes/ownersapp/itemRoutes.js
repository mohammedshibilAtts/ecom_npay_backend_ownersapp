import express from "express";
import ItemRepository from "../../../infrastructure/repositories/ecom/itemRepository.js";
import ProductRepository from "../../../infrastructure/repositories/chit/productRepository.js";
import StoneDetailsRepository from "../../../infrastructure/repositories/ecom/stoneDetailsRepository.js";
import ItemUseCase from "../../../usecases/ownersapp/itemUsecase.js";
import ItemController from "../../controllers/ownersapp/itemController.js";
import { upload } from "../../../utils/multer.js";

const router = express.Router();

const itemRepository = new ItemRepository();
const productRepository = new ProductRepository();
const stoneDetailsRepository = new StoneDetailsRepository();

const itemUseCase = new ItemUseCase(itemRepository, productRepository, stoneDetailsRepository);
const itemController = new ItemController(itemUseCase);

router.post("/", upload.handleUpload(), (req, res) => itemController.createBulkItems(req, res));
router.put("/:id", upload.handleUpload(), (req, res) => itemController.updateItem(req, res));
router.get("/check/:tagId", (req, res) => itemController.verifyItem(req, res));
router.get("/product/:productId", (req, res) => itemController.findByProductId(req, res));
router.patch("/toggle-status/:id", (req, res) => itemController.toggleItemStatus(req, res));

export default router;
