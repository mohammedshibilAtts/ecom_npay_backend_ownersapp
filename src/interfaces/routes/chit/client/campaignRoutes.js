import express from 'express';
import CampaignTypeController from '../../../controllers/chit/admin/client/campaignTypeController.js';
import CampaignTypeUseCase from '../../../../usecases/auth/chit/client/CampaignTypeUseCase.js';
import CampaignTypeRepository from '../../../../infrastructure/repositories/chit/CampaignTypeRepository.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/validation.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
const router = express.Router();

const tokenService= new TokenService();
const validator = new Validator()
const authMiddleware= new AuthMiddleware(tokenService)


const campaignTypeRepository= new CampaignTypeRepository();
const campaignTypeUseCase= new CampaignTypeUseCase(campaignTypeRepository);

const campaignTypeController= new CampaignTypeController(campaignTypeUseCase,validator);

/**
 * @swagger
 * tags:
 *   name: Campaign
 *   description: Management of marketing and promotional campaigns
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/campaigntype:
 *   get:
 *     summary: Get all campaign settings
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Add a new campaign setting
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 */
router.post('/allcampaigntype',(req,res)=>campaignTypeController.getAllActiveCampaignTypeSettings(req,res));

/**
 * @swagger
 * /api/client/campaigntype/{id}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Edit campaign setting
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete campaign setting
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id',(req,res)=>campaignTypeController.getCampaignTypeById(req,res));
router.post('/',(req,res)=>campaignTypeController.addCampaignTypeSetting(req,res));
router.patch('/:id',authMiddleware.protect,(req,res)=>campaignTypeController.editCampaignTypeSetting(req,res));
router.delete('/:id',authMiddleware.protect,(req,res)=>campaignTypeController.deleteCampaignTypeSetting(req,res));

/**
 * @swagger
 * /api/client/campaigntype/{id}/active:
 *   patch:
 *     summary: Toggle campaign active status
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',authMiddleware.protect,(req,res)=>campaignTypeController.changeCampaignTypeActiveStatus(req,res));
router.get('/',(req,res)=>campaignTypeController.getAllCampaignType(req,res));

export default router;