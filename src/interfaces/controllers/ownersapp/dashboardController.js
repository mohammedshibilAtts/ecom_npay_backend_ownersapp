import asyncHandler from '../../../utils/errors/asyncHandler.js';

class DashboardController {
    constructor(dashboardUseCase) {
        this.dashboardUseCase = dashboardUseCase;
    }

    getDashboard = asyncHandler(async (req, res) => {
        const { fromDate, toDate } = req.query;
        const data = await this.dashboardUseCase.executeGetDashboard(fromDate, toDate);

        res.status(200).json({
            success: true,
            data
        });
    });

    overViewReport = asyncHandler(async (req, res) => {
        const filter = { ...req.query };

        const data = await this.dashboardUseCase.executeOverViewReport(filter);
        res.status(200).json({
            success: true,
            data
        });
    });
}

export default DashboardController;
