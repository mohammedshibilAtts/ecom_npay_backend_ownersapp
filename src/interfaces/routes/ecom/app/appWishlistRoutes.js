import express from "express";
import AppWishlistController from "../../../controllers/ecom/app/appWishlistController.js";
import AppWishlistUsecase from "../../../../usecases/ecom/app/appWishlistUsecase.js";
import AppProductUsecase from "../../../../usecases/ecom/app/appProductUsecase.js";
import AppProductRepository from "../../../../infrastructure/repositories/ecom/app/appProductRepository.js";
import WishlistRepository from "../../../../infrastructure/repositories/chit/wishlistRepository.js";
import ItemRepository from "../../../../infrastructure/repositories/ecom/itemRepository.js";
import PurityRepository from "../../../../infrastructure/repositories/chit/purityReporsitory.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";
import TokenService from "../../../../utils/jwtToken.js";

const router = express.Router();

// Dependency Injection
const wishlistRepo = new WishlistRepository();
const productRepo = new AppProductRepository();
const itemRepo = new ItemRepository();
const purityRepo = new PurityRepository();

// We need AppProductUsecase for the _calculateItemPricing helper
const productUsecase = new AppProductUsecase(productRepo, null, null, null, purityRepo, null, null, null, null, itemRepo);

const usecase = new AppWishlistUsecase(wishlistRepo, productRepo, productUsecase);
const controller = new AppWishlistController(usecase);

const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

// Wishlist routes require authentication
router.use(authMiddleware.protect);

router.post("/toggle", (req, res) => controller.toggleWishlist(req, res));
router.get("/", (req, res) => controller.getWishlist(req, res));

export default router;
