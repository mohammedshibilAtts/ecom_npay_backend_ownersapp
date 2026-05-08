import express, { Router } from 'express'
import ReportController from '../../../controllers/chit/admin/client/reportController.js';
import ReportRepository from '../../../../infrastructure/repositories/chit/reportsRepository.js';
import ReportUseCase from '../../../../usecases/auth/chit/client/reportsUsecase.js';
import BranchRepository from '../../../../infrastructure/repositories/chit/brachRepository.js';

const router = express.Router()

const reportRepo = new ReportRepository()
const branchRepo= new BranchRepository()
const reportUsecase = new ReportUseCase(reportRepo,branchRepo)
const reportController = new ReportController(reportUsecase)



// router.post('/preclosesummary',(req,res)=>reportController.getPreCloseSummary(req,res))
// router.post('/redeemptionsummary',(req,res)=>reportController.getRedeemptionSummary(req,res))
// router.post('/refundsummary',(req,res)=>reportController.getRefundSummary(req,res))
// router.get('/employeereferral',(req,res)=>reportController.employeeReferralReport(req,res));
// router.post('/schemeoverall',(req,res)=>reportController.getOverAllReport(req,res))
// router.post('/paymentledger',(req,res)=>reportController.getPaymentLedger(req,res))




// router.post('/outstanding',(req,res)=>reportController.getOutstandingReport(req,res)) ////////////////////////
// router.get('/employeereferral',(req,res)=>reportController.employeeReferralReport(req,res));
// router.get('/customerreferral',(req,res)=>reportController.customerReferralReport(req,res));////////////////////////
// router.post('/outstandingweight',(req,res)=>reportController.outstandingWeight(req,res))

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Analytical reports for schemes, payments, and accounts
 */

/**
 * @swagger
 * /api/client/report/giftreport:
 *   post:
 *     summary: Get gift report
 *     tags: [Report]
 */
router.post('/giftreport',(req,res)=>reportController.giftReport(req,res))

/**
 * @swagger
 * /api/client/report/overallreport:
 *   post:
 *     summary: Get overall analytics report
 *     tags: [Report]
 */
router.post('/overallreport',(req,res)=>reportController.overAllReport(req,res))

/**
 * @swagger
 * /api/client/report/overdue:
 *   post:
 *     summary: Get overdue summary report
 *     tags: [Report]
 */
router.post('/overdue',(req,res)=>reportController.overduesummary(req,res))

/**
 * @swagger
 * /api/client/report/accountsummary:
 *   post:
 *     summary: Get account summary report
 *     tags: [Report]
 */
router.post('/accountsummary',(req,res)=>reportController.accountsummary(req,res))

/**
 * @swagger
 * /api/client/report/paymentsummary:
 *   post:
 *     summary: Get payment summary report
 *     tags: [Report]
 */
router.post('/paymentsummary',(req,res)=>reportController.getPaymentSummary(req,res))

/**
 * @swagger
 * /api/client/report/account/completed:
 *   post:
 *     summary: Get completed accounts report
 *     tags: [Report]
 */
router.post('/account/completed',(req,res)=>reportController.accountCompleted(req,res))

/**
 * @swagger
 * /api/client/report/preclosesummary:
 *   post:
 *     summary: Get pre-close summary report
 *     tags: [Report]
 */
router.post('/preclosesummary',(req,res)=>reportController.getPreCloseSummary(req,res))

/**
 * @swagger
 * /api/client/report/closedsummary:
 *   post:
 *     summary: Get closed accounts summary report
 *     tags: [Report]
 */
router.post('/closedsummary',(req,res)=>reportController.getCloseSummary(req,res))

/**
 * @swagger
 * /api/client/report/refundsummary:
 *   post:
 *     summary: Get refund summary report
 *     tags: [Report]
 */
router.post('/refundsummary',(req,res)=>reportController.getRefendSummary(req,res))

/**
 * @swagger
 * /api/client/report/paymentledger:
 *   post:
 *     summary: Get payment ledger report
 *     tags: [Report]
 */
router.post('/paymentledger',(req,res)=>reportController.getPaymentLedger(req,res))

/**
 * @swagger
 * /api/client/report/amountpayble:
 *   post:
 *     summary: Get amount payable report
 *     tags: [Report]
 */
router.post('/amountpayble',(req,res)=>reportController.getAmountPayble(req,res))

/**
 * @swagger
 * /api/client/report/weightpayble:
 *   post:
 *     summary: Get weight payable report
 *     tags: [Report]
 */
router.post('/weightpayble',(req,res)=>reportController.getWeightPayble(req,res))

/**
 * @swagger
 * /api/client/report/employeereffer:
 *   post:
 *     summary: Get employee referral report
 *     tags: [Report]
 */
router.post('/employeereffer',(req,res)=>reportController.getEmployeeRefferal(req,res))

/**
 * @swagger
 * /api/client/report/customerreffer:
 *   post:
 *     summary: Get customer referral report
 *     tags: [Report]
 */
router.post('/customerreffer',(req,res)=>reportController.getCustomerRefferal(req,res))

/**
 * @swagger
 * /api/client/report/activeaccounts:
 *   post:
 *     summary: Get active accounts report
 *     tags: [Report]
 */
router.post("/activeaccounts",(req,res)=>reportController.getActiveAccounts(req,res))

/**
 * @swagger
 * /api/client/report/redeemedaccounts:
 *   post:
 *     summary: Get redeemed accounts report
 *     tags: [Report]
 */
router.post("/redeemedaccounts",(req,res)=>reportController.getRedeemedAccounts(req,res))


//! drill down option routes

/**
 * @swagger
 * /api/client/report/scheme:
 *   get:
 *     summary: Get detailed scheme view
 *     tags: [Report]
 */
router.get("/scheme",(req,res)=>reportController.getSchemeDetailedView(req,res))

/**
 * @swagger
 * /api/client/report/amount:
 *   post:
 *     summary: Get detailed amount view
 *     tags: [Report]
 */
router.post("/amount",(req,res)=>reportController.getAmountDetailedView(req,res))
    

export default router;