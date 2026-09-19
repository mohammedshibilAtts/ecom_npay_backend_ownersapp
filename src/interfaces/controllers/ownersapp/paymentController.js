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

    addPayment = asyncHandler(async (req, res) => {
        const data = { ...req.body };
        if (req.user && req.user.id_employee) {
            data.created_by = req.user.id_employee;
        }
        const result = await this.paymentUseCase.createPayment(data, req.user);
        if (result && result.success === false) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    });
}

export default PaymentController;
