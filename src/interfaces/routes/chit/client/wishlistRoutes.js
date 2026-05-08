import express from "express";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";
import TokenService from "../../../../utils/jwtToken.js";
import WishlistController from "../../../controllers/chit/admin/client/wishlistController.js";
import WishlistUsecase from "../../../../usecases/auth/chit/client/wishlistUseCase.js";
import WishlistRepository from "../../../../infrastructure/repositories/chit/wishlistRepository.js";


const router = express.Router()
const tokenService = new TokenService()
const authMiddleware= new AuthMiddleware(tokenService)
const wishlistRepo = new WishlistRepository()
const wishlistUsecase = new WishlistUsecase(wishlistRepo)
const wishlistController = new WishlistController(wishlistUsecase)


/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Customer product wishlist management
 */

router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/client/wishlist:
 *   get:
 *     summary: Get customer wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Toggle item in wishlist (Add/Remove)
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 */
router.post('/',(req,res)=>wishlistController.toggleWishlistItem(req,res))
router.get('/',(req,res)=>wishlistController.getWishlist(req,res))

export default router;