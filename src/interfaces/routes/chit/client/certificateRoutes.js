import express from 'express';
import CertificateController from '../../../controllers/chit/admin/client/certificateController.js';
import CertificateRepository from '../../../../infrastructure/repositories/chit/certificateRepository.js';
import CertificateUseCase from '../../../../usecases/auth/chit/client/certificateUseCase.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/validation.js';
import AuthMiddleware from '../../../../utils/middleware/authMiddleware.js';

const router = express.Router();

const tokenService = new TokenService();
const validator = new Validator();
const authMiddleware = new AuthMiddleware(tokenService);

const certificateRepository = new CertificateRepository();
const certificateUseCase = new CertificateUseCase(certificateRepository);
const certificateController = new CertificateController(certificateUseCase, validator);

router.get('/', (req, res) => certificateController.getAllCertificates(req, res));
router.get('/:id', (req, res) => certificateController.getCertificateById(req, res));

router.use(authMiddleware.protect);

router.post('/table', (req, res) => certificateController.certificateTableData(req, res));
router.post('/', (req, res) => certificateController.addCertificate(req, res));
router.patch('/:id', (req, res) => certificateController.editCertificate(req, res));
router.delete('/:id', (req, res) => certificateController.deleteCertificate(req, res));
router.patch('/:id/active', (req, res) => certificateController.toggleActiveState(req, res));

export default router;
