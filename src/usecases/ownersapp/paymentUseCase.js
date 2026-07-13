class PaymentUseCase {
    constructor(paymentRepo) {
        this.paymentRepo = paymentRepo;
    }

    async executeGetPayments(fromDate, toDate, page, limit) {
        return await this.paymentRepo.getPayments(fromDate, toDate, page, limit);
    }
}

export default PaymentUseCase;
