import asyncHandler from '../../../utils/errors/asyncHandler.js';

class EcomReportController {
  constructor(ecomReportUseCase) {
    this.ecomReportUseCase = ecomReportUseCase;
  }

  getOrderPaymentReport = asyncHandler(async (req, res) => {
    try {
      const params = { ...req.query, ...req.body };
      const result = await this.ecomReportUseCase.getOrderPaymentReport(params);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getOrderPaymentReport controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  getProductStockReport = asyncHandler(async (req, res) => {
    try {
      const params = { ...req.query, ...req.body };
      const result = await this.ecomReportUseCase.getProductStockReport(params);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in getProductStockReport controller:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });
}

export default EcomReportController;
