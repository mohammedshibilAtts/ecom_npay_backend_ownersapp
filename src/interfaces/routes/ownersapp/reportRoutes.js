import express from 'express';
import ReportRepository from '../../../infrastructure/repositories/chit/reportsRepository.js';
import BranchRepository from '../../../infrastructure/repositories/chit/brachRepository.js';
import WalletRepository from '../../../infrastructure/repositories/chit/walletRepository.js';
import CartRepository from '../../../infrastructure/repositories/ecom/cartRepository.js';
import ProductRepository from '../../../infrastructure/repositories/chit/productRepository.js';
import OrderRepository from '../../../infrastructure/repositories/ecom/orderRepository.js';
import ShipRocketUseCase from '../../../usecases/auth/ecom/shipRocketUseCase.js';
import PincodeMasterUseCase from '../../../usecases/ecom/pincodeMasterUsecase.js';
import DeliveryAddressRepositary from '../../../infrastructure/repositories/ecom/deliveryaddressRepositary.js';
import ItemRepository from '../../../infrastructure/repositories/ecom/itemRepository.js';
import ActualOrderUseCase from '../../../usecases/auth/ecom/orderUseCase.js';
import ActualReportUseCase from '../../../usecases/auth/chit/client/reportsUsecase.js';
import WalletUseCase from '../../../usecases/auth/chit/client/walletUsecase.js';
import ReportUseCase from '../../../usecases/ownersapp/reportUsecase.js';
import ReportController from '../../controllers/ownersapp/reportController.js';

const reportRepo = new ReportRepository();
const branchRepo = new BranchRepository();
const walletRepo = new WalletRepository();

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();
const shipRocketUseCase = new ShipRocketUseCase();
const pincodeUseCase = new PincodeMasterUseCase();
const deliveryAddressRepository = new DeliveryAddressRepositary();
const itemRepository = new ItemRepository();

const actualOrderUseCase = new ActualOrderUseCase(
  cartRepository,
  productRepository,
  orderRepository,
  shipRocketUseCase,
  pincodeUseCase,
  deliveryAddressRepository,
  itemRepository
);

const actualReportUseCase = new ActualReportUseCase(reportRepo, branchRepo);
const walletUseCase = new WalletUseCase(walletRepo, branchRepo);

const reportUseCase = new ReportUseCase(actualReportUseCase, walletUseCase, actualOrderUseCase);
const reportController = new ReportController(reportUseCase);

const router = express.Router();

router.post('/overallreport', (req, res) => reportController.overAllReport(req, res));
router.post('/shop/order/report/overall', (req, res) => reportController.getShopOrderOverallReport(req, res));
router.post('/overdue', (req, res) => reportController.overduesummary(req, res));
router.post('/overduesummary', (req, res) => reportController.overduesummary(req, res));
router.post('/amountpayble', (req, res) => reportController.getAmountPayable(req, res));
router.post('/amountpayable', (req, res) => reportController.getAmountPayable(req, res));
router.post('/amount', (req, res) => reportController.getAmountDetailedView(req, res));
router.post('/paymentsummary', (req, res) => reportController.getPaymentSummary(req, res));
router.post('/paymentledger', (req, res) => reportController.getPaymentLedger(req, res));
router.post('/redeemtable', (req, res) => reportController.getRedeem(req, res));
router.post('/redeem', (req, res) => reportController.getRedeem(req, res));
router.post('/wallettable', (req, res) => reportController.getAllWallets(req, res));
router.post('/wallet/table', (req, res) => reportController.getAllWallets(req, res));

export default router;
