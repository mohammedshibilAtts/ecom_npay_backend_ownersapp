import schemeAccountModel from "../../models/chit/schemeAccountModel.js";

class SchemeAccountRepo {
    async getSchemeAccounts(fromDate, toDate) {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(0, 0, 0, 0));

        let queryFromDate = startOfDay;
        if (fromDate && !isNaN(new Date(fromDate).getTime())) {
            queryFromDate = new Date(fromDate);
        }

        let queryToDate = endOfDay;
        if (toDate && !isNaN(new Date(toDate).getTime())) {
            queryToDate = new Date(toDate);
        }

        const data = await schemeAccountModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: queryFromDate, $lte: queryToDate },
                    active: true,
                    is_deleted: false
                }
            },
            {
                $lookup: {
                    from: "payments",
                    let: { accountId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$id_scheme_account", "$$accountId"] },
                                payment_status: 1,
                                active: true,
                                is_deleted: false
                            }
                        }
                    ],
                    as: "paymentsList"
                }
            },
            {
                $group: {
                    _id: null,
                    totalActiveAccounts: { $sum: 1 },
                    newAccounts: {
                        $sum: { $cond: [{ $eq: ["$status", 0] }, 1, 0] }
                    },
                    closedAccounts: {
                        $sum: { $cond: [{ $eq: ["$status", 1] }, 1, 0] }
                    },
                    completedAccounts: {
                        $sum: { $cond: [{ $eq: ["$status", 2] }, 1, 0] }
                    },
                    totalPaymentAmount: { $sum: { $sum: "$paymentsList.payment_amount" } },
                    totalMetalWeight: { $sum: { $sum: "$paymentsList.metal_weight" } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalActiveAccounts: 1,
                    newAccounts: 1,
                    closedAccounts: 1,
                    completedAccounts: 1,
                    totalPaymentAmount: 1,
                    totalMetalWeight: 1
                }
            }
        ]);

        const result = data.length > 0 ? data[0] : {
            totalActiveAccounts: 0,
            newAccounts: 0,
            closedAccounts: 0,
            completedAccounts: 0,
            totalPaymentAmount: 0,
            totalMetalWeight: 0
        };

        return {
            dateRange: {
                fromDate: queryFromDate,
                toDate: queryToDate
            },
            ...result
        };
    }
}

export default SchemeAccountRepo;
