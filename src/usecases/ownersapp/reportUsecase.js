import ActualReportUseCase from "../auth/chit/client/reportsUsecase.js";

class ReportUseCase {
  constructor(actualReportUseCase, walletUseCase, actualOrderUseCase) {
    this.actualReportUseCase = actualReportUseCase;
    this.walletUseCase = walletUseCase;
    this.actualOrderUseCase = actualOrderUseCase;
  }

  async getShopOrderOverallReport(body = {}) {
    if (this.actualOrderUseCase) {
      const { fromDate, toDate } = body || {};
      return await this.actualOrderUseCase.getOverAllReport(fromDate, toDate);
    }
    return { success: false, message: "Order usecase not initialized" };
  }

  async overAllReport(query) {
    return await this.actualReportUseCase.overAllReport(query);
  }

  async overduesummary(body) {
    return await this.actualReportUseCase.overduesummary(body);
  }

  async getPreCloseSummary(body) {
    return await this.actualReportUseCase.getPreCloseSummary(body);
  }

  async getCloseSummary(body) {
    return await this.actualReportUseCase.getCloseSummary(body);
  }

  async getAmountPayable(body) {
    return await this.actualReportUseCase.getAmountPayable(body);
  }

  async getAmountDetailedView(body) {
    return await this.actualReportUseCase.getAmountDetailedView(body);
  }

  async getPaymentSummary(body) {
    return await this.actualReportUseCase.getPaymentSummary(body);
  }

  async getPaymentLedger(body) {
    return await this.actualReportUseCase.getPaymentLedger(body);
  }

  async getRedeem(body) {
    if (this.walletUseCase) {
      return await this.walletUseCase.getRedeem(body);
    }
    return { success: false, message: "Wallet usecase not initialized" };
  }

  async getAllWallets(body) {
    if (this.walletUseCase) {
      if (typeof body === 'object' && body !== null) {
        const { page = 1, limit = 10, search = "", from_date, to_date } = body;
        return await this.walletUseCase.getAllWallets(page, limit, search, from_date, to_date);
      }
      return await this.walletUseCase.getAllWallets(body);
    }
    return { success: false, message: "Wallet usecase not initialized" };
  }
}

export default ReportUseCase;
