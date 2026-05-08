import express from 'express';
import SubMenuController from '../../../controllers/chit/admin/client/subMenuController.js';
import SubMenuUseCase from '../../../../usecases/auth/chit/client/subMenuUseCase.js';
import SubMenuRepository from '../../../../infrastructure/repositories/chit/subMenuRepository.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/validation.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
// import S3Service from '../../../../utils/s3Bucket.js';
// import {upload} from '../../../../utils/multer.js';
// import HashingService from '../../../../utils/bcrypt.js';
const router = express.Router();

const tokenService= new TokenService();
const validator = new Validator()
const authMiddleware= new AuthMiddleware(tokenService)
// const hashingService= new HashingService();
// const s3service= new S3Service();

const subMenuRepository= new SubMenuRepository();
const subMenuUseCase= new SubMenuUseCase(subMenuRepository);

const subMenuController= new SubMenuController(subMenuUseCase,validator);


/**
 * @swagger
 * tags:
 *   name: SubMenu
 *   description: Management of application sub-menus
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/submenusetting:
 *   post:
 *     summary: Add new sub-menu setting
 *     tags: [SubMenu]
 *     security:
 *       - bearerAuth: []
 */
router.post('/',(req,res)=>subMenuController.addSubMenuSetting(req,res));

/**
 * @swagger
 * /api/client/submenusetting/submenu:
 *   post:
 *     summary: Get all active sub-menu settings
 *     tags: [SubMenu]
 *     security:
 *       - bearerAuth: []
 */
router.post('/submenu',(req,res)=>subMenuController.getAllActiveSubMenuSettings(req,res));

/**
 * @swagger
 * /api/client/submenusetting/{id}:
 *   get:
 *     summary: Get sub-menu by ID
 *     tags: [SubMenu]
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Edit sub-menu setting
 *     tags: [SubMenu]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete sub-menu setting
 *     tags: [SubMenu]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id',(req,res)=>subMenuController.getSubMenuById(req,res));
router.patch('/:id',(req,res)=>subMenuController.editSubMenuSetting(req,res));
router.delete('/:id',(req,res)=>subMenuController.deleteSubMenuSetting(req,res));

/**
 * @swagger
 * /api/client/submenusetting/{id}/active:
 *   patch:
 *     summary: Toggle sub-menu active status
 *     tags: [SubMenu]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',(req,res)=>subMenuController.changeSubMenuActiveStatus(req,res));

export default router;