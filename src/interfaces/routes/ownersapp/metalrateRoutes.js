import express from 'express';
import MetalRateRepo from '../../../infrastructure/repositories/ownersapp/metalrateRepo.js';
import MetalRateUseCase from '../../../usecases/ownersapp/metalrateUseCase.js';
import MetalRateController from '../../controllers/ownersapp/metalrateController.js';

const metalRateRepo = new MetalRateRepo();
const metalRateUseCase = new MetalRateUseCase(metalRateRepo);
const metalRateController = new MetalRateController(metalRateUseCase);

const router = express.Router();

router.get('/metalrates', metalRateController.getMetalRate);
router.post('/metalrates', metalRateController.setMetalRate);

export default router;
