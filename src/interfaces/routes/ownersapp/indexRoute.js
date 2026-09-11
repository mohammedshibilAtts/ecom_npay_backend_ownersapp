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

export default router;
