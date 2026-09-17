class EcomReportUseCase {
  constructor(orderUseCase, productUseCase) {
    this.orderUseCase = orderUseCase;
    this.productUseCase = productUseCase;
  }

  async getOrderPaymentReport(params = {}) {
    const { page, limit, search, from_date, to_date, paymentMode } = params;
    return await this.orderUseCase.getPaymentReport(
      page,
      limit,
      search,
      from_date,
      to_date,
      paymentMode
    );
  }

  async getProductStockReport(params = {}) {
    const { page, limit, search, from_date, to_date, category, subcategory, metal } = params;
    return await this.productUseCase.getProductStockReport(
      page,
      limit,
      search,
      from_date,
      to_date,
      category,
      subcategory,
      metal
    );
  }
}

export default EcomReportUseCase;
