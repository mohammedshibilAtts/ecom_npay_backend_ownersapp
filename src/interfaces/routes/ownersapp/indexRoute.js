import express from 'express';
import dashboardRoutes from './dashboardRoutes.js';
import ownersAppAuthMiddleware from '../../../utils/middleware/ownersAppAuthMiddleware.js';
import schemeAccountRoutes from './schemeAccountRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import metalRateRoutes from './metalrateRoutes.js';
import customerRoutes from './customerRoutes.js';
import schemeRoutes from './schemeRoutes.js';
import locationRoutes from './locationRoutes.js';
import commonRoutes from './commonRoutes.js';
import bannerRoutes from './bannerRoutes.js';
import offerRoutes from './offerRoutes.js';
import productRoutes from './productRoutes.js';
import itemRoutes from './itemRoutes.js';
import orderRoutes from './orderRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import reportRoutes from './reportRoutes.js';

const router = express.Router();

router.use(ownersAppAuthMiddleware.protect);

router.use('/', dashboardRoutes);
router.use("/", schemeAccountRoutes);
router.use("/", paymentRoutes);
router.use("/", metalRateRoutes);
router.use("/", customerRoutes);
router.use("/", schemeRoutes);
router.use("/", locationRoutes);
router.use("/", commonRoutes);
router.use("/banner", bannerRoutes);
router.use("/offer", offerRoutes);
router.use("/product", productRoutes);
router.use("/item", itemRoutes);
router.use("/order", orderRoutes);
router.use("/employee", employeeRoutes);
router.use("/report", reportRoutes);

export default router;
