import express from 'express';
import DashboardController from '../../controllers/ownersapp/dashboardController.js';
import DashboardRepo from '../../../infrastructure/repositories/ownersapp/dashboardRepo.js';
import DashboardUseCase from '../../../usecases/ownersapp/dashboardUseCase.js';
import ClientDashboardUseCase from '../../../usecases/auth/chit/client/dashboardUseCase.js';
import BranchRepository from '../../../infrastructure/repositories/chit/brachRepository.js';
import ChitDashboardRepository from '../../../infrastructure/repositories/chit/dashboardRepository.js';

import CustomerRepo from '../../../infrastructure/repositories/ownersapp/customerRepo.js';
import CustomerUseCase from '../../../usecases/ownersapp/customerUseCase.js';

const router = express.Router();

const dashboardRepo = new DashboardRepo();

const branchRepo = new BranchRepository();
const chitDashboardRepo = new ChitDashboardRepository();
const clientDashboardUseCase = new ClientDashboardUseCase(branchRepo, chitDashboardRepo);

const customerRepo = new CustomerRepo();
const customerUseCase = new CustomerUseCase(customerRepo);

const dashboardUseCase = new DashboardUseCase(dashboardRepo, clientDashboardUseCase, customerUseCase);
const dashboardController = new DashboardController(dashboardUseCase);

router.get('/dashboard', (req, res) => dashboardController.getDashboard(req, res));
router.get('/overview', (req, res) => dashboardController.overViewReport(req, res));

export default router;
