import paymentModel from "../../models/chit/paymentModel.js";
import customerModel from "../../models/chit/customerModel.js";
import metalRateModel from "../../models/chit/metalRateModel.js";

class DashboardRepo {
    async getDashboardStats(fromDate, toDate) {
        const now = new Date();
        const endOfDay = new Date(new Date(now).setHours(23, 59, 59, 999));
        const startOfOneWeekAgo = new Date(new Date(now).setDate(now.getDate() - 6));
        startOfOneWeekAgo.setHours(0, 0, 0, 0);

        let queryFromDate = startOfOneWeekAgo;
        if (fromDate && !isNaN(new Date(fromDate).getTime())) {
            queryFromDate = new Date(fromDate);
        }

        let queryToDate = endOfDay;
        if (toDate && !isNaN(new Date(toDate).getTime())) {
            queryToDate = new Date(toDate);
        }

        const duration = queryToDate.getTime() - queryFromDate.getTime();
        const prevFromDate = new Date(queryFromDate.getTime() - duration - 1);

        const [paymentStatsResult, customerStatsResult, metalRatesResult] = await Promise.all([
            paymentModel.aggregate([
                {
                    $match: {
                        date_payment: { $gte: prevFromDate, $lte: queryToDate },
                        payment_status: 1,
                        active: true,
                        is_deleted: false
                    }
                },
                {
                    $lookup: {
                        from: "schemes",
                        localField: "id_scheme",
                        foreignField: "_id",
                        as: "schemeInfo"
                    }
                },
                { $unwind: { path: "$schemeInfo", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "metals",
                        localField: "schemeInfo.id_metal",
                        foreignField: "_id",
                        as: "metalInfo"
                    }
                },
                { $unwind: { path: "$metalInfo", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: null,
                        totalAmount: {
                            $sum: {
                                $cond: [{ $gte: ["$date_payment", queryFromDate] }, "$payment_amount", 0]
                            }
                        },
                        prevTotalAmount: {
                            $sum: {
                                $cond: [{ $lt: ["$date_payment", queryFromDate] }, "$payment_amount", 0]
                            }
                        },
                        goldSavings: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$date_payment", queryFromDate] },
                                            { $gte: [{ $indexOfBytes: [{ $ifNull: [{ $toLower: "$metalInfo.metal_name" }, ""] }, "gold"] }, 0] }
                                        ]
                                    },
                                    { $ifNull: ["$metal_weight", 0] },
                                    0
                                ]
                            }
                        },
                        prevGoldSavings: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $lt: ["$date_payment", queryFromDate] },
                                            { $gte: [{ $indexOfBytes: [{ $ifNull: [{ $toLower: "$metalInfo.metal_name" }, ""] }, "gold"] }, 0] }
                                        ]
                                    },
                                    { $ifNull: ["$metal_weight", 0] },
                                    0
                                ]
                            }
                        },
                        silverSavings: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$date_payment", queryFromDate] },
                                            { $gte: [{ $indexOfBytes: [{ $ifNull: [{ $toLower: "$metalInfo.metal_name" }, ""] }, "silver"] }, 0] }
                                        ]
                                    },
                                    { $ifNull: ["$metal_weight", 0] },
                                    0
                                ]
                            }
                        },
                        prevSilverSavings: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $lt: ["$date_payment", queryFromDate] },
                                            { $gte: [{ $indexOfBytes: [{ $ifNull: [{ $toLower: "$metalInfo.metal_name" }, ""] }, "silver"] }, 0] }
                                        ]
                                    },
                                    { $ifNull: ["$metal_weight", 0] },
                                    0
                                ]
                            }
                        }
                    }
                }
            ]),
            customerModel.aggregate([
                {
                    $match: {
                        createdAt: { $lte: queryToDate },
                        active: true,
                        is_deleted: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        // totalCustomers: { $sum: 1 },
                        newJoiners: {
                            $sum: {
                                $cond: [
                                    { $gte: ["$createdAt", queryFromDate] },
                                    1,
                                    0
                                ]
                            }
                        },
                        prevNewJoiners: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$createdAt", prevFromDate] },
                                            { $lt: ["$createdAt", queryFromDate] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        prevNewJoiners: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$createdAt", prevFromDate] },
                                            { $lt: ["$createdAt", queryFromDate] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ]),
            metalRateModel.aggregate([
                { $match: { active: true, is_deleted: false } },
                { $sort: { createdAt: -1 } },
                {
                    $group: {
                        _id: { material_type_id: "$material_type_id", purity_id: "$purity_id" },
                        doc: { $first: "$$ROOT" }
                    }
                },
                { $replaceRoot: { newRoot: "$doc" } },
                {
                    $lookup: {
                        from: "purities",
                        localField: "purity_id",
                        foreignField: "_id",
                        as: "purityInfo"
                    }
                },
                { $unwind: { path: "$purityInfo", preserveNullAndEmptyArrays: true } },
                { $match: { "purityInfo.metalNumber": { $in: [1, 2] } } },
                {
                    $lookup: {
                        from: "metals",
                        localField: "material_type_id",
                        foreignField: "_id",
                        as: "metalInfo"
                    }
                },
                { $unwind: { path: "$metalInfo", preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        purityPriority: {
                            $switch: {
                                branches: [
                                    { case: { $regexMatch: { input: { $ifNull: ["$purityInfo.purity_name", ""] }, regex: /24/i } }, then: 30 },
                                    { case: { $regexMatch: { input: { $ifNull: ["$purityInfo.purity_name", ""] }, regex: /22/i } }, then: 20 },
                                    { case: { $regexMatch: { input: { $ifNull: ["$purityInfo.purity_name", ""] }, regex: /18/i } }, then: 10 },
                                    { case: { $regexMatch: { input: { $ifNull: ["$purityInfo.purity_name", ""] }, regex: /999/i } }, then: 30 },
                                    { case: { $regexMatch: { input: { $ifNull: ["$purityInfo.purity_name", ""] }, regex: /965/i } }, then: 20 }
                                ],
                                default: 0
                            }
                        }
                    }
                },
                {
                    $sort: {
                        "purityInfo.metalNumber": 1,
                        purityPriority: -1,
                        createdAt: -1
                    }
                },
                {
                    $group: {
                        _id: "$purityInfo.metalNumber",
                        doc: { $first: "$$ROOT" }
                    }
                },
                { $replaceRoot: { newRoot: "$doc" } },
                { $sort: { "purityInfo.metalNumber": 1 } }
            ])
        ]);

        const paymentStats = paymentStatsResult[0] || { totalAmount: 0, prevTotalAmount: 0, goldSavings: 0, prevGoldSavings: 0, silverSavings: 0, prevSilverSavings: 0 };
        const customerStats = customerStatsResult[0] || { totalCustomers: 0, newJoiners: 0, prevNewJoiners: 0 };

        const metalRates = metalRatesResult.map(rate => ({
            metalId: rate.material_type_id,
            purityId: rate.purity_id,
            metalName: rate.metalInfo?.metal_name || "",
            purityName: rate.purityInfo?.purity_name || "",
            metalRate: rate.rate,
            metalNumber: rate.purityInfo?.metalNumber
        }));

        const calculatePercentageChange = (current, previous) => {
            if (previous === 0) {
                return current > 0 ? 100 : 0;
            }
            return Number((((current - previous) / previous) * 100).toFixed(2));
        };

        return {
            dateRange: {
                fromDate: queryFromDate,
                toDate: queryToDate
            },
            totalPayments: paymentStats.totalAmount,
            totalPaymentsChange: calculatePercentageChange(paymentStats.totalAmount, paymentStats.prevTotalAmount),

            totalCustomers: customerStats.totalCustomers,

            newJoiners: customerStats.newJoiners,
            newJoinersChange: calculatePercentageChange(customerStats.newJoiners, customerStats.prevNewJoiners),

            goldSavings: paymentStats.goldSavings,
            goldSavingsChange: calculatePercentageChange(paymentStats.goldSavings, paymentStats.prevGoldSavings),

            silverSavings: paymentStats.silverSavings,
            silverSavingsChange: calculatePercentageChange(paymentStats.silverSavings, paymentStats.prevSilverSavings),

            metalRates
        };
    }
}

export default DashboardRepo;
