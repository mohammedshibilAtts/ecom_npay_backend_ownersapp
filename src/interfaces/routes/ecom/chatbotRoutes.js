import express from "express";
import ChatbotController from "../../controllers/ecom/chatbotController.js";
import ChatbotUsecase from "../../../usecases/ecom/chatbotUsecase.js";
import ChatbotRepository from "../../../infrastructure/repositories/ecom/chatbotRepository.js";

const router = express.Router();

// Dependency Injection
const repository = new ChatbotRepository();
const usecase = new ChatbotUsecase(repository);
const controller = new ChatbotController(usecase);

// Admin Routes (Adding and editing questions/answers)
router.post("/", (req, res) => controller.createNode(req, res));
router.put("/:id/options", (req, res) => controller.addOption(req, res));

// Client Routes (Retrieving the chat flow)
router.get("/root", (req, res) => controller.getRootNodes(req, res));
router.get("/:id", (req, res) => controller.getNodeById(req, res));

export default router;
