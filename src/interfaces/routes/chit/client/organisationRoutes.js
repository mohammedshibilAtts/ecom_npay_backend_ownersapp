import express from "express";
import OrganisationRepository from "../../../../infrastructure/repositories/chit/organisationRepository.js";
import TokenService from "../../../../utils/jwtToken.js";
import AuthMiddleware from "../../../../utils/middleware/authMiddleware.js";
import Validator from "../../../../utils/validations/organisationValidations.js";
import OrganisationUsecase from "../../../../usecases/auth/chit/client/organisationUsecase.js";
import OrganisationController from "../../../controllers/chit/admin/client/organisationController.js";
import { upload } from "../../../../utils/multer.js";
import S3Service from "../../../../utils/s3Bucket.js";
import S3BucketRepository from "../../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js";

const router = express.Router();
const organisationRepo = new OrganisationRepository();
const tokeService = new TokenService();
const s3service = new S3Service();
const authMiddleware = new AuthMiddleware(tokeService);
const validator = new Validator();
const s3Repo = new S3BucketRepository()
const organisationUsecase = new OrganisationUsecase(
  organisationRepo,
  s3service,
  s3Repo
);
const organisationController = new OrganisationController(
  organisationUsecase,
  validator
);

/**
 * @swagger
 * tags:
 *   name: Organisation
 *   description: Management of organization global settings and branding
 */

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/client/organisation:
 *   get:
 *     summary: Get organization details
 *     tags: [Organisation]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Update organization details with branding assets
 *     tags: [Organisation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *               small_logo:
 *                 type: string
 *                 format: binary
 *               favicon:
 *                 type: string
 *                 format: binary
 */
router.post(
  "/",
  upload.handleUpload([
    { name: "logo", maxCount: 1 },
    { name: "small_logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
    { name: "login", maxCount: 1 },
    { name: "background", maxCount: 1 },
    { name: "bottom_logo", maxCount: 1 },
  ]),
  (req, res) => organisationController.addOrgDetails(req, res)
);
router.get("/", (req, res) => organisationController.getDetails(req, res));
export default router;