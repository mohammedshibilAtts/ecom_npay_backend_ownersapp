import paymentModel from "../../models/chit/paymentModel.js";
import customerModel from "../../models/chit/customerModel.js";
import metalRateModel from "../../models/chit/metalRateModel.js";
import schemeModel from "../../models/chit/schemeModel.js";

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
                    $match: {
                        "metalInfo.active": { $ne: false },
                        "metalInfo.is_deleted": { $ne: true },
                        $or: [
                            {
                                $and: [
                                    { $or: [{ "metalInfo.id_metal": 1 }, { "purityInfo.metalNumber": 1 }] },
                                    { "purityInfo.id_purity": 1 }
                                ]
                            },
                            {
                                $or: [{ "metalInfo.id_metal": 2 }, { "purityInfo.metalNumber": 2 }]
                            }
                        ]
                    }
                },
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
                        material_type_id: 1,
                        purityPriority: -1,
                        createdAt: -1
                    }
                },
                {
                    $group: {
                        _id: "$material_type_id",
                        doc: { $first: "$$ROOT" }
                    }
                },
                { $replaceRoot: { newRoot: "$doc" } },
                { $sort: { "metalInfo.id_metal": 1, createdAt: -1 } }
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
            metalNumber: rate.metalInfo?.id_metal || rate.purityInfo?.metalNumber || 1
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

    async getWeightBymetal(fromDate, toDate) {
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

        const filter = {
            createdAt: { $gte: prevFromDate, $lte: queryToDate },
            payment_status: 1,
            active: true,
            is_deleted: false
        };

        const calculateGrowth = (thisMonth, lastMonth) => {
            const increase = thisMonth >= lastMonth;
            let percentage = 0;
            if (lastMonth === 0) {
                percentage = thisMonth > 0 ? 100 : 0;
            } else {
                percentage = Math.min(
                    Math.round(
                        Math.abs(((thisMonth - lastMonth) / lastMonth) * 100) * 100,
                    ) / 100,
                    100,
                );
            }
            return { increase, percentage };
        };

        const results = await paymentModel.aggregate([
            { $match: filter },
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
                    goldCurrentWeight: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$createdAt", queryFromDate] },
                                        {
                                            $or: [
                                                { $eq: ["$metalInfo.id_metal", 1] },
                                                { $regexMatch: { input: { $ifNull: ["$metalInfo.metal_name", ""] }, regex: /gold/i } }
                                            ]
                                        }
                                    ]
                                },
                                { $ifNull: ["$metal_weight", 0] },
                                0
                            ]
                        }
                    },
                    goldPrevWeight: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $lt: ["$createdAt", queryFromDate] },
                                        {
                                            $or: [
                                                { $eq: ["$metalInfo.id_metal", 1] },
                                                { $regexMatch: { input: { $ifNull: ["$metalInfo.metal_name", ""] }, regex: /gold/i } }
                                            ]
                                        }
                                    ]
                                },
                                { $ifNull: ["$metal_weight", 0] },
                                0
                            ]
                        }
                    },
                    silverCurrentWeight: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$createdAt", queryFromDate] },
                                        {
                                            $or: [
                                                { $eq: ["$metalInfo.id_metal", 2] },
                                                { $regexMatch: { input: { $ifNull: ["$metalInfo.metal_name", ""] }, regex: /silver/i } }
                                            ]
                                        }
                                    ]
                                },
                                { $ifNull: ["$metal_weight", 0] },
                                0
                            ]
                        }
                    },
                    silverPrevWeight: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $lt: ["$createdAt", queryFromDate] },
                                        {
                                            $or: [
                                                { $eq: ["$metalInfo.id_metal", 2] },
                                                { $regexMatch: { input: { $ifNull: ["$metalInfo.metal_name", ""] }, regex: /silver/i } }
                                            ]
                                        }
                                    ]
                                },
                                { $ifNull: ["$metal_weight", 0] },
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const stats = results[0] || {
            goldCurrentWeight: 0,
            goldPrevWeight: 0,
            silverCurrentWeight: 0,
            silverPrevWeight: 0
        };

        const goldWeight = stats.goldCurrentWeight || 0;
        const goldPrevWeight = stats.goldPrevWeight || 0;
        const goldWeightGrowth = calculateGrowth(goldWeight, goldPrevWeight);

        const silverWeight = stats.silverCurrentWeight || 0;
        const silverPrevWeight = stats.silverPrevWeight || 0;
        const silverWeightGrowth = calculateGrowth(silverWeight, silverPrevWeight);

        return {
            gold: {
                weight: goldWeight,
                goldWeightGrowth
            },
            silver: {
                weight: silverWeight,
                silverWeightGrowth
            }
        };
    }


    async getSchemes(fromDate, toDate) {
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

        const calculateGrowth = (thisMonth, lastMonth) => {
            const increase = thisMonth >= lastMonth;
            let percentage = 0;
            if (lastMonth === 0) {
                percentage = thisMonth > 0 ? 100 : 0;
            } else {
                percentage = Math.min(
                    Math.round(
                        Math.abs(((thisMonth - lastMonth) / lastMonth) * 100) * 100,
                    ) / 100,
                    100,
                );
            }
            return { increase, percentage };
        };

        const [thisPeriod, lastPeriod, totalCount] = await Promise.all([
            schemeModel.countDocuments({
                active: true,
                is_deleted: false,
                createdAt: { $gte: queryFromDate, $lte: queryToDate }
            }),
            schemeModel.countDocuments({
                active: true,
                is_deleted: false,
                createdAt: { $gte: prevFromDate, $lt: queryFromDate }
            }),
            schemeModel.countDocuments({
                active: true,
                is_deleted: false
            })
        ]);

        const growth = calculateGrowth(thisPeriod, lastPeriod);

        return {
            value: totalCount,
            increase: growth.increase,
            percentage: growth.percentage
        };
    }
}

export default DashboardRepo;
