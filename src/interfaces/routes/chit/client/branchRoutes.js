import express from 'express';
import BranchController from '../../../controllers/chit/admin/client/branchController.js';
import BranchRepository from '../../../../infrastructure/repositories/chit/brachRepository.js';
import BranchUsecase from '../../../../usecases/auth/chit/client/brachUseCase.js';
import Validator from '../../../../utils/validations/validation.js';

const router = express.Router();

const branchRepository = new BranchRepository();
const branchUsecase = new BranchUsecase(branchRepository);
const validator = new Validator();
const branchController = new BranchController(branchUsecase, validator);

/**
 * @swagger
 * tags:
 *   name: Branch
 *   description: Management of organization branches
 */

/**
 * @swagger
 * /api/client/branch/table:
 *   post:
 *     summary: Get branch table data
 *     tags: [Branch]
 */
router.post('/table', (req, res) => branchController.branchTable(req, res));

/**
 * @swagger
 * /api/client/branch/{id}:
 *   get:
 *     summary: Get branch by ID
 *     tags: [Branch]
 *   patch:
 *     summary: Update branch details
 *     tags: [Branch]
 *   delete:
 *     summary: Delete a branch
 *     tags: [Branch]
 */
router.get('/:id', (req, res) => branchController.getBranchById(req, res));

/**
 * @swagger
 * /api/client/branch:
 *   get:
 *     summary: Get all active branches
 *     tags: [Branch]
 *   post:
 *     summary: Add a new branch
 *     tags: [Branch]
 */
router.post('/', (req, res) => branchController.addBranch(req, res));
router.patch('/:id', (req, res) => branchController.updateBranch(req, res));

/**
 * @swagger
 * /api/client/branch/{id}/active:
 *   patch:
 *     summary: Toggle branch active status
 *     tags: [Branch]
 */
router.patch('/:id/active', (req, res) => branchController.changeStatus(req, res));
router.delete('/:id', (req, res) => branchController.deleteBranch(req, res));
router.get('/',(req,res)=>branchController.getAllBranch(req,res));

export default router;