import asyncHandler from '../../../utils/errors/asyncHandler.js';

class ReportController {
  constructor(reportUseCase) {
    this.reportUseCase = reportUseCase;
  }

  overAllReport = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.overAllReport(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in overAllReport controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getShopOrderOverallReport = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.getShopOrderOverallReport(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getShopOrderOverallReport controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  overduesummary = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.overduesummary(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in overduesummary controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getPreCloseSummary = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.getPreCloseSummary(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getPreCloseSummary controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getCloseSummary = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.getCloseSummary(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getCloseSummary controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getAmountPayable = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.getAmountPayable(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAmountPayable controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getAmountDetailedView = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.getAmountDetailedView(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAmountDetailedView controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getPaymentSummary = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.getPaymentSummary(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getPaymentSummary controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getPaymentLedger = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.getPaymentLedger(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getPaymentLedger controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getRedeem = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.getRedeem(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getRedeem controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getAllWallets = asyncHandler(async (req, res) => {
    try {
      const result = await this.reportUseCase.getAllWallets(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAllWallets controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });
}

export default ReportController;
