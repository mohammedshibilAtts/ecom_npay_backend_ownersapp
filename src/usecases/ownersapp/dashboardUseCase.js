class DashboardUseCase {
    constructor(dashboardRepo, clientDashboardUseCase) {
        this.dashboardRepo = dashboardRepo;
        this.clientDashboardUseCase = clientDashboardUseCase;
    }

    async executeGetDashboard(fromDate, toDate) {
        return await this.dashboardRepo.getDashboardStats(fromDate, toDate);
    }

    async executeOverViewReport(filter) {
        return await this.clientDashboardUseCase.accountStat(filter);
    }
}

export default DashboardUseCase;
