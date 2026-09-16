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
router.get('/category', commonController.getActiveCategory);
router.get('/subcategory/:categoryId', commonController.getSubcategoryByCategory);
router.get('/subcategory', commonController.getSubcategoryByCategory);
router.get('/metal', commonController.getMetal);
router.get('/purity', commonController.getPurityByMetalId);
router.get('/purity/:metalId', commonController.getPurityByMetalId);
router.get('/schemetype', commonController.getSchemeTypes);
router.get('/wastagetype', commonController.getWastageType);
router.get('/fundtype', commonController.getFundType);
router.get('/installmenttype', commonController.getInstallmentType);
router.get('/classification', commonController.getClassifications);
router.get('/color', commonController.getColorMaster);
router.get('/certificate', commonController.getCertificates);
router.get('/collection', commonController.getCollections);
router.get('/stonemaster', commonController.getStoneMasters);
router.get('/metalrate/current', commonController.getTodaysMetalRateByMetal);
router.get('/department', commonController.getDepartment);

export default router;
