import express from "express";
import EmployeeRepository from "../../../infrastructure/repositories/chit/EmployeeRepository.js";
import BranchRepository from "../../../infrastructure/repositories/chit/brachRepository.js";
import S3BucketRepository from "../../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js";
import S3Service from "../../../utils/s3Bucket.js";
import Validator from "../../../utils/validations/employeeValidations.js";
import { upload } from "../../../utils/multer.js";
import ActualEmployeeUseCase from "../../../usecases/auth/chit/client/employeeUseCase.js";
import EmployeeUseCase from "../../../usecases/ownersapp/employeeUsecase.js";
import EmployeeController from "../../controllers/ownersapp/employeeController.js";

const employeeRepository = new EmployeeRepository();
const branchRepository = new BranchRepository();
const s3Repo = new S3BucketRepository();
const s3service = new S3Service();
const validator = new Validator();

const actualEmployeeUseCase = new ActualEmployeeUseCase(
  employeeRepository,
  s3service,
  branchRepository,
  s3Repo
);

const employeeUseCase = new EmployeeUseCase(actualEmployeeUseCase);
const employeeController = new EmployeeController(employeeUseCase, validator);

const router = express.Router();

router.post(
  "/table",
  (req, res) => employeeController.getAllEmployees(req, res)
);

router.post(
  "/",
  upload.handleUpload([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  (req, res) => employeeController.addEmployee(req, res)
);

router.patch(
  "/:id",
  upload.handleUpload([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  (req, res) => employeeController.editEmployee(req, res)
);

router.patch("/:id/active", (req, res) => employeeController.activateEmployee(req, res));
router.delete("/:id", (req, res) => employeeController.deleteEmployee(req, res));
router.get("/mobile", (req, res) => employeeController.getEmployeeByMobile(req, res));
router.get("/:id", (req, res) => employeeController.getEmployeeById(req, res));

export default router;
