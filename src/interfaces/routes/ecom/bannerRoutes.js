import express from "express";
import BannerController from "../../controllers/ecom/bannerController.js";
import BannerUsecase from "../../../usecases/ecom/bannerUsecase.js";
import BannerRepository from "../../../infrastructure/repositories/ecom/bannerRepository.js";
import S3Service from "../../../utils/s3Bucket.js";
import { upload } from "../../../utils/multer.js";

const router = express.Router();

const repository = new BannerRepository();
const s3Service = new S3Service();
const usecase = new BannerUsecase(repository, s3Service);
const controller = new BannerController(usecase);

router.post("/", upload.handleUpload('image'), (req, res) => controller.createBanner(req, res));
router.get("/", (req, res) => controller.getAllBanners(req, res));
router.get("/web", (req, res) => controller.getActiveWebBanners(req, res));
router.put("/:id", upload.handleUpload('image'), (req, res) => controller.updateBanner(req, res));
router.patch("/:id/toggle", (req, res) => controller.toggleStatus(req, res));
router.delete("/:id", (req, res) => controller.deleteBanner(req, res));

export default router;
