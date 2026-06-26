import express from 'express';
import ColorController from '../../../controllers/chit/admin/client/colorController.js';
import ColorRepository from '../../../../infrastructure/repositories/chit/colorRepository.js';
import ColorUseCase from '../../../../usecases/auth/chit/client/colorUseCase.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/validation.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';

const router = express.Router();

const tokenService = new TokenService();
const validator = new Validator();
const authMiddleware = new AuthMiddleware(tokenService);

const colorRepository = new ColorRepository();
const colorUseCase = new ColorUseCase(colorRepository);
const colorController = new ColorController(colorUseCase, validator);

router.get('/', (req, res) => colorController.getAllColors(req, res));
router.get('/:id', (req, res) => colorController.getColorById(req, res));

router.use(authMiddleware.protect);

router.post('/table', (req, res) => colorController.colorTableData(req, res));
router.post('/', (req, res) => colorController.addColor(req, res));
router.patch('/:id', (req, res) => colorController.editColor(req, res));
router.delete('/:id', (req, res) => colorController.deleteColor(req, res));
router.patch('/:id/active', (req, res) => colorController.toggleColorActiveState(req, res));

export default router;
