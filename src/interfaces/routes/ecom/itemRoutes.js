// src/interfaces/routes/itemRoutes.js

import express from "express";
import ItemRepository from "../../../infrastructure/repositories/ecom/itemRepository.js";
import ItemUseCase from "../../../usecases/auth/ecom/itemUsecase.js";
import ItemController from "../../controllers/ecom/itemController.js";
import ProductRepository from "../../../infrastructure/repositories/chit/productRepository.js";

const router = express.Router();

const itemRepository = new ItemRepository();
const productRepository = new ProductRepository();

const itemUseCase = new ItemUseCase(itemRepository, productRepository);
const itemController = new ItemController(itemUseCase);

router.post("/", (req, res) => itemController.createBulkItems(req, res));

router.get("/product/:productId", (req, res) =>
  itemController.findByProductId(req, res),
);

router.get("/check/:tagId", (req, res) => itemController.verifyItem(req, res));

export default router;
