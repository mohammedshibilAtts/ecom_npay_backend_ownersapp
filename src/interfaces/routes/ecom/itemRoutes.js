// src/interfaces/routes/itemRoutes.js

import express from "express";
import ItemRepository from "../../../infrastructure/repositories/ecom/itemRepository.js";
import ItemUseCase from "../../../usecases/auth/ecom/itemUsecase.js";
import ItemController from "../../controllers/ecom/itemController.js";
import ProductRepository from "../../../infrastructure/repositories/chit/productRepository.js";
import StoneDetailsRepository from "../../../infrastructure/repositories/ecom/stoneDetailsRepository.js";
import { upload } from "../../../utils/multer.js";

const router = express.Router();

const itemRepository = new ItemRepository();
const productRepository = new ProductRepository();
const stoneDetailsRepository = new StoneDetailsRepository();

const itemUseCase = new ItemUseCase(itemRepository, productRepository, stoneDetailsRepository);
const itemController = new ItemController(itemUseCase);

router.post("/", upload.handleUpload(), (req, res) => itemController.createBulkItems(req, res));

router.get("/product/:productId", (req, res) =>
  itemController.findByProductId(req, res),
);

router.get("/check/:tagId", (req, res) => itemController.verifyItem(req, res));

router.patch(
  "/toggle-status/:id",
  (req, res) => itemController.toggleItemStatus(req, res)
);

router.put("/:id", upload.handleUpload(), (req, res) =>  itemController.updateItem(req,res));

export default router;
