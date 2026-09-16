import ActualOrderUseCase from "../auth/ecom/orderUseCase.js";

class OrderUseCase {
  constructor(actualOrderUseCase) {
    this.actualOrderUseCase = actualOrderUseCase;
  }

  async getAllOrders(query) {
    return await this.actualOrderUseCase.getAllOrders(query);
  }

  async getOrderItemReport(orderId) {
    return await this.actualOrderUseCase.getOrderItemReport(orderId);
  }
}

export default OrderUseCase;
