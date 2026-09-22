import express from 'express';
import SchemeRepo from '../../../infrastructure/repositories/ownersapp/schemeRepo.js';
import SchemeUseCase from '../../../usecases/ownersapp/schemeUseCase.js';
import SchemeController from '../../controllers/ownersapp/schemeController.js';
import { upload } from '../../../utils/multer.js';

const schemeRepo = new SchemeRepo();
const schemeUseCase = new SchemeUseCase(schemeRepo);
const schemeController = new SchemeController(schemeUseCase);

const router = express.Router();

router.get('/schemes', schemeController.getSchemeCount);
router.get('/schemes/details', schemeController.getSchemeDetails);
router.post('/scheme', upload.handleUpload([{ name: "logo", maxCount: 1 }, { name: "desc_img", maxCount: 1 }]), (req, res) => schemeController.addScheme(req, res));
router.post('/scheme/table', (req, res) => schemeController.schemesTableData(req, res));
router.patch('/scheme/:id/active', (req, res) => schemeController.toggleSchemeStatus(req, res));
router.post('/scheme/delist', (req, res) => schemeController.getDelistSchemes(req, res));
router.get('/scheme/classification', (req, res) => schemeController.getSchemeByclassificationId(req, res));

export default router;
