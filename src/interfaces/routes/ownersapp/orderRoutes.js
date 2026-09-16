import express from 'express';
import CartRepository from '../../../infrastructure/repositories/ecom/cartRepository.js';
import ProductRepository from '../../../infrastructure/repositories/chit/productRepository.js';
import OrderRepository from '../../../infrastructure/repositories/ecom/orderRepository.js';
import ShipRocketUseCase from '../../../usecases/auth/ecom/shipRocketUseCase.js';
import PincodeMasterUseCase from '../../../usecases/ecom/pincodeMasterUsecase.js';
import DeliveryAddressRepositary from '../../../infrastructure/repositories/ecom/deliveryaddressRepositary.js';
import ItemRepository from '../../../infrastructure/repositories/ecom/itemRepository.js';
import ActualOrderUseCase from '../../../usecases/auth/ecom/orderUseCase.js';
import OrderUseCase from '../../../usecases/ownersapp/orderUsecase.js';
import OrderController from '../../controllers/ownersapp/orderController.js';

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

const orderUseCase = new OrderUseCase(actualOrderUseCase);
const orderController = new OrderController(orderUseCase);

const router = express.Router();

router.get('/order/all', (req, res) => orderController.getAllOrders(req, res));
router.get('/report/:id', (req, res) => orderController.getOrderItemReport(req, res));

export default router;
