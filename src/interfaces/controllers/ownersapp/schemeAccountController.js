import asyncHandler from '../../../utils/errors/asyncHandler.js';

class SchemeAccountController {
    constructor(schemeAccountUseCase) {
        this.schemeAccountUseCase = schemeAccountUseCase;
    }

    getSchemeAccounts = asyncHandler(async (req, res) => {
        const { fromDate, toDate } = req.query;
        const data = await this.schemeAccountUseCase.executeGetSchemeAccounts(fromDate, toDate);

        res.status(200).json({
            success: true,
            data
        });
    });
}

export default SchemeAccountController;
