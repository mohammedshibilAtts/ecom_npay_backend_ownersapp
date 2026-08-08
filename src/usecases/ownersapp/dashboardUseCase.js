class DashboardUseCase {
    constructor(dashboardRepo) {
        this.dashboardRepo = dashboardRepo;
    }

    async executeGetDashboard(fromDate, toDate) {
        return await this.dashboardRepo.getDashboardStats(fromDate, toDate);
    }
}

export default DashboardUseCase;
