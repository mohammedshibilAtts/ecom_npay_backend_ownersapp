import express from 'express';
import CommonRepo from '../../../infrastructure/repositories/ownersapp/commonRepo.js';
import CommonUseCase from '../../../usecases/ownersapp/commonUseCase.js';
import CommonController from '../../controllers/ownersapp/commonController.js';

const commonRepo = new CommonRepo();
const commonUseCase = new CommonUseCase(commonRepo);
const commonController = new CommonController(commonUseCase);

const router = express.Router();

router.get('/gender', commonController.getGender);
router.get('/branch', commonController.getBranch);

export default router;
