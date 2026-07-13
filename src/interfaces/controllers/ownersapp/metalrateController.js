import asyncHandler from '../../../utils/errors/asyncHandler.js';

class MetalRateController {
    constructor(metalRateUseCase) {
        this.metalRateUseCase = metalRateUseCase;
    }

    getMetalRate = asyncHandler(async (req, res) => {
        const branchId = req.query.branchId || req.params.branchId || req?.user?.branch;
        const date = req.query.date || req.params.date;

        const data = await this.metalRateUseCase.getMetalRate(branchId, date);

        res.status(200).json({
            success: true,
            data
        });
    });

    setMetalRate = asyncHandler(async (req, res) => {
        const data = await this.metalRateUseCase.setMetalRate(req.body);

        res.status(200).json({
            success: true,
            data
        });
    });
}

export default MetalRateController;
