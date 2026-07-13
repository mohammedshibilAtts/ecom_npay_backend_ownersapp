import schemeAccountModel from "../../models/chit/schemeAccountModel.js";
import paymentModel from "../../models/chit/paymentModel.js";
import schemeModel from "../../models/chit/schemeModel.js";

class SchemeRepo {
    async getSchemeCount(query) {
        try {
            const filter = { ...query };
            let startDate, endDate;

            if (filter.fromDate && filter.toDate) {
                startDate = new Date(filter.fromDate);
                endDate = new Date(filter.toDate);
                delete filter.fromDate;
                delete filter.toDate;
            } else {
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
            }

            const duration = endDate.getTime() - startDate.getTime();
            const prevStartDate = new Date(startDate.getTime() - duration - 1);

            const schemeFilter = { ...filter, createdAt: { $gte: prevStartDate, $lte: endDate } };
            const paymentFilter = { ...filter, createdAt: { $gte: prevStartDate, $lte: endDate }, payment_status: 1 };

            const [schemeStats, paymentStats, activeSchemesCount] = await Promise.all([
                schemeAccountModel.aggregate([
                    { $match: schemeFilter },
                    {
                        $group: {
                            _id: null,
                            newAccounts: {
                                $sum: {
                                    $cond: [{ $gte: ["$createdAt", startDate] }, 1, 0]
                                }
                            },
                            prevNewAccounts: {
                                $sum: {
                                    $cond: [{ $lt: ["$createdAt", startDate] }, 1, 0]
                                }
                            },
                            completedAccounts: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $gte: ["$createdAt", startDate] }, { $eq: ["$status", 2] }] }, 1, 0
                                    ]
                                }
                            },
                            prevCompletedAccounts: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $lt: ["$createdAt", startDate] }, { $eq: ["$status", 2] }] }, 1, 0
                                    ]
                                }
                            }
                        }
                    }
                ]),
                paymentModel.aggregate([
                    { $match: paymentFilter },
                    {
                        $lookup: {
                            from: "schemeaccounts",
                            localField: "id_scheme_account",
                            foreignField: "_id",
                            as: "schemeAccount"
                        }
                    },
                    { $unwind: { path: "$schemeAccount", preserveNullAndEmptyArrays: true } },
                    {
                        $lookup: {
                            from: "schemes",
                            localField: "schemeAccount.id_scheme",
                            foreignField: "_id",
                            as: "scheme"
                        }
                    },
                    { $unwind: { path: "$scheme", preserveNullAndEmptyArrays: true } },
                    {
                        $lookup: {
                            from: "metals",
                            localField: "scheme.id_metal",
                            foreignField: "_id",
                            as: "metal"
                        }
                    },
                    { $unwind: { path: "$metal", preserveNullAndEmptyArrays: true } },
                    {
                        $group: {
                            _id: null,
                            receivedAmount: {
                                $sum: {
                                    $cond: [{ $gte: ["$createdAt", startDate] }, { $ifNull: ["$payment_amount", 0] }, 0]
                                }
                            },
                            prevReceivedAmount: {
                                $sum: {
                                    $cond: [{ $lt: ["$createdAt", startDate] }, { $ifNull: ["$payment_amount", 0] }, 0]
                                }
                            },
                            goldSavings: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $gte: ["$createdAt", startDate] }, { $regexMatch: { input: { $ifNull: ["$metal.metal_name", ""] }, regex: /gold/i } }] },
                                        { $ifNull: ["$metal_weight", 0] },
                                        0
                                    ]
                                }
                            },
                            prevGoldSavings: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $lt: ["$createdAt", startDate] }, { $regexMatch: { input: { $ifNull: ["$metal.metal_name", ""] }, regex: /gold/i } }] },
                                        { $ifNull: ["$metal_weight", 0] },
                                        0
                                    ]
                                }
                            },
                            silverSavings: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $gte: ["$createdAt", startDate] }, { $regexMatch: { input: { $ifNull: ["$metal.metal_name", ""] }, regex: /silver/i } }] },
                                        { $ifNull: ["$metal_weight", 0] },
                                        0
                                    ]
                                }
                            },
                            prevSilverSavings: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $lt: ["$createdAt", startDate] }, { $regexMatch: { input: { $ifNull: ["$metal.metal_name", ""] }, regex: /silver/i } }] },
                                        { $ifNull: ["$metal_weight", 0] },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                ]),
                schemeModel.countDocuments({ active: true, is_deleted: false })
            ]);

            const schemesResult = schemeStats.length > 0 ? schemeStats[0] : { newAccounts: 0, prevNewAccounts: 0, completedAccounts: 0, prevCompletedAccounts: 0 };
            const paymentsResult = paymentStats.length > 0 ? paymentStats[0] : { receivedAmount: 0, prevReceivedAmount: 0, goldSavings: 0, prevGoldSavings: 0, silverSavings: 0, prevSilverSavings: 0 };

            const calculatePercentageChange = (current, previous) => {
                if (previous === 0) {
                    return current > 0 ? 100 : 0;
                }
                return Number((((current - previous) / previous) * 100).toFixed(2));
            };

            return {
                totalActiveSchemes: activeSchemesCount,

                newAccounts: schemesResult.newAccounts,
                newAccountsChange: calculatePercentageChange(schemesResult.newAccounts, schemesResult.prevNewAccounts),

                completedAccounts: schemesResult.completedAccounts,
                completedAccountsChange: calculatePercentageChange(schemesResult.completedAccounts, schemesResult.prevCompletedAccounts),

                receivedAmount: paymentsResult.receivedAmount,
                receivedAmountChange: calculatePercentageChange(paymentsResult.receivedAmount, paymentsResult.prevReceivedAmount),

                goldSavings: paymentsResult.goldSavings,
                goldSavingsChange: calculatePercentageChange(paymentsResult.goldSavings, paymentsResult.prevGoldSavings),

                silverSavings: paymentsResult.silverSavings,
                silverSavingsChange: calculatePercentageChange(paymentsResult.silverSavings, paymentsResult.prevSilverSavings)
            };
        } catch (error) {
            console.error("Error in getSchemeCount repo:", error);
            throw error;
        }
    }

    async getSchemeDetails(query) {
        try {
            const filter = { ...query };
            let startDate, endDate;

            if (filter.fromDate && filter.toDate) {
                startDate = new Date(filter.fromDate);
                endDate = new Date(filter.toDate);
                delete filter.fromDate;
                delete filter.toDate;
            }

            const schemeAccountMatch = {
                active: true,
                status: 0
            };

            if (startDate && endDate) {
                schemeAccountMatch.createdAt = { $gte: startDate, $lte: endDate };
            }

            const schemeMatch = {
                ...filter,
                active: true,
                is_deleted: false
            };

            const result = await schemeModel.aggregate([
                {
                    $match: schemeMatch
                },
                {
                    $lookup: {
                        from: "schemeaccounts",
                        let: { schemeId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$id_scheme", "$$schemeId"] },
                                    ...schemeAccountMatch
                                }
                            },
                            {
                                $count: "activeCount"
                            }
                        ],
                        as: "accounts"
                    }
                },
                {
                    $addFields: {
                        totalActiveAccounts: {
                            $ifNull: [{ $arrayElemAt: ["$accounts.activeCount", 0] }, 0]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        scheme_name: 1,
                        totalActiveAccounts: 1,
                        active: 1
                    }
                }
            ]);

            return result;
        } catch (error) {
            console.error("Error in getSchemeDetails repo:", error);
            throw error;
        }
    }
}

export default SchemeRepo;
