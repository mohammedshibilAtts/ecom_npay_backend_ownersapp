import express from 'express';
import MenuController from '../../../controllers/chit/admin/client/menuController.js';
import MenuUseCase from '../../../../usecases/auth/chit/client/MenuUseCase.js';
import MenuRepository from '../../../../infrastructure/repositories/chit/MenuRepository.js';
import TokenService from '../../../../utils/jwtToken.js';
import Validator from '../../../../utils/validations/validation.js';
import AuthMiddleware  from '../../../../utils/middleware/authMiddleware.js';
// import S3Service from '../../../../utils/s3Bucket.js';
import menuIconUploader from '../../../../utils/menuIconUploader.js';
const router = express.Router();

const tokenService= new TokenService();
const validator = new Validator()
const authMiddleware= new AuthMiddleware(tokenService)
// const s3service= new S3Service();

const menuRepository= new MenuRepository();
const menuUseCase= new MenuUseCase(menuRepository);

const menuController= new MenuController(menuUseCase,validator);


/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Management of application menus and icons
 */

/**
 * @swagger
 * /api/client/menusetting/allmenu:
 *   post:
 *     summary: Get all active menu settings
 *     tags: [Menu]
 */
router.post('/allmenu',(req,res)=>menuController.getAllActiveMenuSettings(req,res));

/**
 * @swagger
 * /api/client/menusetting/{id}:
 *   get:
 *     summary: Get menu setting by ID
 *     tags: [Menu]
 */
router.get('/:id',(req,res)=>menuController.getMenuById(req,res));
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/menusetting:
 *   get:
 *     summary: Get all menus
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Add new menu setting (with icon)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */
router.post('/',menuIconUploader.handleMenuIconUpload(),(req,res)=>menuController.addMenuSetting(req,res));

/**
 * @swagger
 * /api/client/menusetting/{id}:
 *   patch:
 *     summary: Edit menu setting
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete menu setting
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id',menuIconUploader.handleMenuIconUpload(),authMiddleware.protect,(req,res)=>menuController.editMenuSetting(req,res));
router.delete('/:id',authMiddleware.protect,(req,res)=>menuController.deleteMenuSetting(req,res));

/**
 * @swagger
 * /api/client/menusetting/{id}/active:
 *   patch:
 *     summary: Toggle menu active status
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/active',authMiddleware.protect,(req,res)=>menuController.changeMenuActiveStatus(req,res));
router.get('/',(req,res)=>menuController.getAllMenu(req,res));

export default router;