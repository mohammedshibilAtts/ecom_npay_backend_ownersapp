import express from 'express';
import DashboardController from '../../controllers/ownersapp/dashboardController.js';
import DashboardRepo from '../../../infrastructure/repositories/ownersapp/dashboardRepo.js';
import DashboardUseCase from '../../../usecases/ownersapp/dashboardUseCase.js';
import ClientDashboardUseCase from '../../../usecases/auth/chit/client/dashboardUseCase.js';
import BranchRepository from '../../../infrastructure/repositories/chit/brachRepository.js';
import ChitDashboardRepository from '../../../infrastructure/repositories/chit/dashboardRepository.js';

const router = express.Router();

const dashboardRepo = new DashboardRepo();

const branchRepo = new BranchRepository();
const chitDashboardRepo = new ChitDashboardRepository();
const clientDashboardUseCase = new ClientDashboardUseCase(branchRepo, chitDashboardRepo);

const dashboardUseCase = new DashboardUseCase(dashboardRepo, clientDashboardUseCase);
const dashboardController = new DashboardController(dashboardUseCase);

router.get('/dashboard', (req, res) => dashboardController.getDashboard(req, res));
router.post('/overview', (req, res) => dashboardController.overViewReport(req, res));

export default router;
