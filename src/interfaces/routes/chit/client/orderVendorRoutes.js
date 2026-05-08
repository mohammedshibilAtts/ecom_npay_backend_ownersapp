import express from "express";
import OrderVendorRepository from "../../../../infrastructure/repositories/chit/orderVendorRepository.js";
import OrderVendorUsecase from "../../../../usecases/auth/chit/client/orderVendorUsecase.js";
import OrderVendorController from "../../../controllers/chit/admin/client/orderVendorController.js";
import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";

const router = express.Router()

const vendorRepo = new OrderVendorRepository()
const tokenService = new TokenService()
const authMiddleware = new AuthMiddleware(tokenService)
const vendorUsecase = new OrderVendorUsecase(vendorRepo)
const vendorController  = new OrderVendorController(vendorUsecase)

/**
 * @swagger
 * tags:
 *   name: OrderVendor
 *   description: Management of vendors specialized in order fulfillment
 */

router.use(authMiddleware.protect)

/**
 * @swagger
 * /api/client/ordervendor:
 *   post:
 *     summary: Add a new order vendor
 *     tags: [OrderVendor]
 *     security:
 *       - bearerAuth: []
 */
router.post('/',(req,res)=>vendorController.addVendor(req,res))

/**
 * @swagger
 * /api/client/ordervendor/{id}:
 *   patch:
 *     summary: Update vendor details
 *     tags: [OrderVendor]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id',(req,res)=>vendorController.updateVendor(req,re))

export default router;