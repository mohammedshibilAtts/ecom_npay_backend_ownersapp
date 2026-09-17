import express from 'express';
import OrderRepository from '../../../infrastructure/repositories/ecom/orderRepository.js';
import ProductRepository from '../../../infrastructure/repositories/chit/productRepository.js';
import OrderUseCase from '../../../usecases/auth/ecom/orderUseCase.js';
import ProductUseCase from '../../../usecases/auth/chit/client/productUseCase.js';
import EcomReportUseCase from '../../../usecases/ownersapp/ecomReportUseCase.js';
import EcomReportController from '../../controllers/ownersapp/ecomReportController.js';

const orderRepo = new OrderRepository();
const productRepo = new ProductRepository();

const orderUseCase = new OrderUseCase(null, productRepo, orderRepo);
const productUseCase = new ProductUseCase(productRepo);

const ecomReportUseCase = new EcomReportUseCase(orderUseCase, productUseCase);
const ecomReportController = new EcomReportController(ecomReportUseCase);

const router = express.Router();

router.get('/order/payment', (req, res) => ecomReportController.getOrderPaymentReport(req, res));
router.get('/product/report/stock', (req, res) => ecomReportController.getProductStockReport(req, res));

export default router;
