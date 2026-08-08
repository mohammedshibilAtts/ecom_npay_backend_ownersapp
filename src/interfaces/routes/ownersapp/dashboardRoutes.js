import express from 'express';
import DashboardController from '../../controllers/ownersapp/dashboardController.js';
import DashboardRepo from '../../../infrastructure/repositories/ownersapp/dashboardRepo.js';
import DashboardUseCase from '../../../usecases/ownersapp/dashboardUseCase.js';

const router = express.Router();

const dashboardRepo = new DashboardRepo();
const dashboardUseCase = new DashboardUseCase(dashboardRepo);
const dashboardController = new DashboardController(dashboardUseCase);

router.get('/dashboard', (req, res) => dashboardController.getDashboard(req, res));

export default router;
