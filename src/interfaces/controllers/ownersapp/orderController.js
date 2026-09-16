import asyncHandler from '../../../utils/errors/asyncHandler.js';

class OrderController {
  constructor(orderUseCase) {
    this.orderUseCase = orderUseCase;
  }

  getAllOrders = asyncHandler(async (req, res) => {
    try {
      const result = await this.orderUseCase.getAllOrders(req.query);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("Error in getAllOrders controller:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

  getOrderItemReport = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.orderUseCase.getOrderItemReport(id);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("Error in getOrderItemReport controller:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });
}

export default OrderController;
