class PaymentUseCase {
    constructor(paymentRepo, actualPaymentUseCase) {
        this.paymentRepo = paymentRepo;
        this.actualPaymentUseCase = actualPaymentUseCase;
    }

    async executeGetPayments(fromDate, toDate, page, limit) {
        return await this.paymentRepo.getPayments(fromDate, toDate, page, limit);
    }

    async createPayment(data, user) {
        if (this.actualPaymentUseCase) {
            return await this.actualPaymentUseCase.addPayment(data, user);
        }
        return { success: false, message: "Payment usecase not initialized" };
    }
}

export default PaymentUseCase;
