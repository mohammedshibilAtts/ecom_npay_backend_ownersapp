import asyncHandler from '../../../utils/errors/asyncHandler.js';

class PaymentController {
    constructor(paymentUseCase) {
        this.paymentUseCase = paymentUseCase;
    }

    getPayments = asyncHandler(async (req, res) => {
        const { fromDate, toDate, page = 1, limit = 5 } = req.query;
        const data = await this.paymentUseCase.executeGetPayments(fromDate, toDate, page, limit);

        res.status(200).json({
            success: true,
            data
        });
    });
}

export default PaymentController;
