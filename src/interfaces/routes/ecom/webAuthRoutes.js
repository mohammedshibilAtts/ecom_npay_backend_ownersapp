import express from 'express';
import WebAuthController from '../../controllers/ecom/webAuthController.js';
import WebAuthUsecase from '../../../usecases/ecom/webAuthUsecase.js';

const router = express.Router();

const usecase = new WebAuthUsecase();
const controller = new WebAuthController(usecase);

router.post('/signup', (req, res) => controller.signup(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));
router.get('/me', (req, res) => controller.authMe(req, res));

export default router;
