import express from "express";
import WalletController from "../../../controllers/chit/admin/client/walletController.js";
import WalletRepository from "../../../../infrastructure/repositories/chit/walletRepository.js";
import WalletUsecase from "../../../../usecases/auth/chit/client/walletUsecase.js";
import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";
import BranchRepository from "../../../../infrastructure/repositories/chit/brachRepository.js";


const router  = express.Router();

const walletRepo = new WalletRepository();
const branchRepo = new BranchRepository();
const walletUsecase = new WalletUsecase(walletRepo,branchRepo);
const walletController = new WalletController(walletUsecase);
const tokenService  = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Customer loyalty wallet and referrals
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/wallet/history:
 *   get:
 *     summary: Get wallet transaction history
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.get('/history',(req,res)=>walletController.getWalletHistoryByWalletId(req,res));

/**
 * @swagger
 * /api/client/wallet/get-rate:
 *   get:
 *     summary: Get current wallet conversion rate
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.get('/get-rate',(req,res)=>walletController.getWalletRate(req,res));

/**
 * @swagger
 * /api/client/wallet/table:
 *   post:
 *     summary: Get wallets table data
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.post('/table',(req,res)=>walletController.getAllWallets(req,res));

/**
 * @swagger
 * /api/client/wallet/redeemtable:
 *   post:
 *     summary: Get redeem transactions table data
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.post('/redeemtable',(req,res)=>walletController.getRedeem(req,res));

/**
 * @swagger
 * /api/client/wallet/ratet/{id}/active:
 *   patch:
 *     summary: Toggle wallet rate status
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/ratet/:id/active',(req,res)=>walletController.activateWalletRate(req,res));

/**
 * @swagger
 * /api/client/wallet:
 *   get:
 *     summary: Get wallet data
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.post ('/',(req,res)=>walletController.addWallet(req,res));

/**
 * @swagger
 * /api/client/wallet/{id}/add:
 *   patch:
 *     summary: Add balance to a wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/add',(req,res)=>walletController.addBalanceToWallet(req,res));

/**
 * @swagger
 * /api/client/wallet/redeem:
 *   post:
 *     summary: Redeem wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.post('/redeem',(req,res)=>walletController.redeemFromWallet(req,res));

/**
 * @swagger
 * /api/client/wallet/{id}/active:
 *   patch:
 *     summary: Toggle wallet active status
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',(req,res)=>walletController.activateWallet(req,res));

/**
 * @swagger
 * /api/client/wallet/{id}:
 *   delete:
 *     summary: Delete a wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id',(req,res)=>walletController.deletedWallet(req,res));

/**
 * @swagger
 * /api/client/wallet/customer-details:
 *   get:
 *     summary: Get customer wallet details
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.get('/customer-details',(req,res)=>walletController.getCustomerWalletDetails(req,res));

/**
 * @swagger
 * /api/client/wallet/mobile:
 *   get:
 *     summary: Get wallet data by mobile number
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.get('/mobile',(req,res)=>walletController.getWalletDataByMobile(req,res));

/**
 * @swagger
 * /api/client/wallet/user/redeemData:
 *   post:
 *     summary: Get redeem history for current user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.post('/user/redeemData',(req,res)=>walletController.getRedeemByUser(req,res));

/**
 * @swagger
 * /api/client/wallet/refferal-list/user:
 *   post:
 *     summary: Get referral list for current user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.post('/refferal-list/user',(req,res)=>walletController.getRefferalListByUser(req,res));

/**
 * @swagger
 * /api/client/wallet/refferal-list/payment/{id}:
 *   post:
 *     summary: Get referral payment data
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 */
router.post('/refferal-list/payment/:id',(req,res)=>walletController.getRefferalPayment(req,res));

router.get('/',(req,res)=>walletController.getWalletData(req,res));


export default router;