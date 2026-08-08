import express from 'express';
import LocationRepo from '../../../infrastructure/repositories/ownersapp/locationRepo.js';
import LocationUseCase from '../../../usecases/ownersapp/locationUseCase.js';
import LocationController from '../../controllers/ownersapp/locationController.js';

const locationRepo = new LocationRepo();
const locationUseCase = new LocationUseCase(locationRepo);
const locationController = new LocationController(locationUseCase);

const router = express.Router();

router.get('/country', locationController.getCountry);
router.get('/state', locationController.getState);
router.get('/city', locationController.getCity);

export default router;
