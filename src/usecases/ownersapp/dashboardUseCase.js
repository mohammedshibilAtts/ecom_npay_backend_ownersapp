class DashboardUseCase {
    constructor(dashboardRepo, clientDashboardUseCase, customerUseCase) {
        this.dashboardRepo = dashboardRepo;
        this.clientDashboardUseCase = clientDashboardUseCase;
        this.customerUseCase = customerUseCase;
    }

    async executeGetDashboard(fromDate, toDate) {
        return await this.dashboardRepo.getDashboardStats(fromDate, toDate);
    }

    async executeOverViewReport(filter) {
         const {fromDate,toDate} = filter
        const overview = await this.clientDashboardUseCase.accountStat({startDate:fromDate, endDate:toDate});
        const {
            newCustomer = 0,
            receivedWeights = 0,
            receivedAmounts = 0,
            newAccounts = 0,
            completedAccount = 0,
            closedAccount = 0,
            newCustomerGrowth = { increase: true, percentage: 0 },
            weightGrowth = { increase: true, percentage: 0 },
            amountGrowth = { increase: true, percentage: 0 },
            newAccountsGrowth = { increase: true, percentage: 0 },
            completedAccountGrowth = { increase: true, percentage: 0 },
            closedAccountGrowth = { increase: true, percentage: 0 }
        } = overview?.data || {};

        const customerQuery = {
            fromDate: filter?.fromDate,
            toDate: filter?.toDate,
        };

        const customerStats = await this.customerUseCase.getCustomers(customerQuery);
        const {
            totalActiveCustomers = 0,
            totalActiveCustomersChange = 0,
            overDue = 0,
            overDueChange = 0,
            totalReferrals = 0,
            totalReferralsChange = 0
        } = customerStats || {};

        const metalWeight = await this.dashboardRepo.getWeightBymetal(customerQuery.fromDate, customerQuery.toDate);
        const scheme = await this.dashboardRepo.getSchemes(customerQuery.fromDate, customerQuery.toDate);

        const parseGrowth = (growth) => {
            if (growth && typeof growth === 'object') {
                return {
                    increase: growth.increase ?? true,
                    percentage: growth.percentage ?? 0
                };
            }
            const val = Number(growth) || 0;
            return {
                increase: val >= 0,
                percentage: Math.abs(val)
            };
        };

        return {
            customers: {
                new: {
                    value: newCustomer,
                    ...parseGrowth(newCustomerGrowth)
                },
                total: {
                    value: totalActiveCustomers,
                    ...parseGrowth(totalActiveCustomersChange)
                }
            },
            collections: {
                weight: {
                    value: receivedWeights,
                    ...parseGrowth(weightGrowth)
                },
                amount: {
                    value: receivedAmounts,
                    ...parseGrowth(amountGrowth)
                }
            },
            accounts: {
                new: {
                    value: newAccounts,
                    ...parseGrowth(newAccountsGrowth)
                },
                completed: {
                    value: completedAccount,
                    ...parseGrowth(completedAccountGrowth)
                },
                closed: {
                    value: closedAccount,
                    ...parseGrowth(closedAccountGrowth)
                }
            },
            overdue: {
                value: overDue,
                ...parseGrowth(overDueChange)
            },
            referrals: {
                value: totalReferrals,
                ...parseGrowth(totalReferralsChange)
            },
            metal: {
                gold: {
                    value: metalWeight?.gold?.weight || 0,
                    ...parseGrowth(metalWeight?.gold?.goldWeightGrowth)
                },
                silver: {
                    value: metalWeight?.silver?.weight || 0,
                    ...parseGrowth(metalWeight?.silver?.silverWeightGrowth)
                }
            },
            scheme
        };
    }
}

export default DashboardUseCase;
