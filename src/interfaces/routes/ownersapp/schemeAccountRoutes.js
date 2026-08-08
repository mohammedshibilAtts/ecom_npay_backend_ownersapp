import express from 'express';
import SchemeAccountController from '../../controllers/ownersapp/schemeAccountController.js';
import SchemeAccountRepo from '../../../infrastructure/repositories/ownersapp/schemeAccountRepo.js';
import SchemeAccountUseCase from '../../../usecases/ownersapp/schemeAccountUseCase.js';

const router = express.Router();

const schemeAccountRepo = new SchemeAccountRepo();
const schemeAccountUseCase = new SchemeAccountUseCase(schemeAccountRepo);
const schemeAccountController = new SchemeAccountController(schemeAccountUseCase);

router.get('/schemeaccounts', (req, res) => schemeAccountController.getSchemeAccounts(req, res));

export default router;
