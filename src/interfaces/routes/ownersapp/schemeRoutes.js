import express from 'express';
import SchemeRepo from '../../../infrastructure/repositories/ownersapp/schemeRepo.js';
import SchemeUseCase from '../../../usecases/ownersapp/schemeUseCase.js';
import SchemeController from '../../controllers/ownersapp/schemeController.js';

const schemeRepo = new SchemeRepo();
const schemeUseCase = new SchemeUseCase(schemeRepo);
const schemeController = new SchemeController(schemeUseCase);

const router = express.Router();

router.get('/schemes', schemeController.getSchemeCount);
router.get('/schemes/details', schemeController.getSchemeDetails);

export default router;
