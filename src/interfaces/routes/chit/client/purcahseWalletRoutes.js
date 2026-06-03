import express from 'express';
import PurchaseWalletController from '../../../controllers/chit/admin/client/purcahseWalletController.js';
import PurchaseWalletUsecase from '../../../../usecases/auth/chit/client/purcahseWalletUsecase.js';
import purchaseWalletRepository from '../../../../infrastructure/repositories/chit/purchaseWalletRepository.js';
import purcahseWalletModel from '../../../../infrastructure/models/chit/purcahseWalletModel.js';
import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";

const router = express.Router();

const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);
const purchaseWalletUsecase = new PurchaseWalletUsecase(purcahseWalletModel, purchaseWalletRepository);
const purchaseWalletController = new PurchaseWalletController(purchaseWalletUsecase);

router.use(authMiddleware.protect);
router.post('/add', (req, res) => purchaseWalletController.addWeight(req, res));
router.get('/coupon/history', (req, res) =>
    purchaseWalletController.couponHistory(req, res)
);
router.get('/wallet/:customerId', (req, res) =>
    purchaseWalletController.getWalletByCustomer(req, res)
);
router.get('/history/:walletId', (req, res) =>
    purchaseWalletController.getHistoryByWallet(req, res)
);
router.put('/history/revert/:historyId', (req, res) =>
    purchaseWalletController.revertHistory(req, res)
);
router.patch('/coupon/issue', (req, res) =>
    purchaseWalletController.issueCoupon(req, res)
);

export default router;