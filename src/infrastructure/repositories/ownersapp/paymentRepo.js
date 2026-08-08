import paymentModel from "../../models/chit/paymentModel.js";

class PaymentRepo {
    async getPayments(fromDate, toDate, page = 1, limit = 10) {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setUTCHours(23, 59, 59, 999);

        let queryFromDate = startOfDay;
        if (fromDate && !isNaN(new Date(fromDate).getTime())) {
            const parsedFromDate = new Date(fromDate);
            parsedFromDate.setUTCHours(0, 0, 0, 0);
            queryFromDate = parsedFromDate;
        }

        let queryToDate = endOfDay;
        if (toDate && !isNaN(new Date(toDate).getTime())) {
            const parsedToDate = new Date(toDate);
            parsedToDate.setUTCHours(23, 59, 59, 999);
            queryToDate = parsedToDate;
        }

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skipNum = (pageNum - 1) * limitNum;

        const baseMatch = {
            $match: {
                date_payment: { $gte: queryFromDate, $lte: queryToDate },
                payment_status: 1,
                active: true,
                is_deleted: false
            }
        };

        const countGroup = {
            $group: {
                _id: null,
                totalPaymentsCount: { $sum: 1 }
            }
        };

        let pipeline = [
            baseMatch,
            {
                $lookup: {
                    from: "schemeaccounts",
                    localField: "id_scheme_account",
                    foreignField: "_id",
                    as: "schemeAccount",
                },
            },
            { $unwind: { path: "$schemeAccount", preserveNullAndEmptyArrays: true } },
            { $match: { "schemeAccount.status": { $nin: [4, 3] } } },
            {
                $lookup: {
                    from: "paymentmodes",
                    localField: "payment_mode",
                    foreignField: "_id",
                    as: "payment_mode_info",
                },
            },
            {
                $unwind: {
                    path: "$payment_mode_info",
                    preserveNullAndEmptyArrays: true,
                },
            }
        ];

        let facetOptions = {
            globalTotals: [
                countGroup,
                {
                    $project: {
                        _id: 0,
                        totalPaymentsCount: 1
                    }
                }
            ],
            paginatedResults: [
                { $sort: { createdAt: -1 } },
                { $skip: skipNum },
                { $limit: limitNum },
                {
                    $lookup: {
                        from: "schemes",
                        localField: "id_scheme",
                        foreignField: "_id",
                        as: "scheme_info"
                    }
                },
                { $unwind: { path: "$scheme_info", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        customername: "$schemeAccount.account_name",
                        payment_amount: 1,
                        scheme_name: "$scheme_info.scheme_name",
                        createdAt: 1
                    }
                }
            ]
        };

        if (limitNum <= 5) {
            facetOptions.modeWise = [
                {
                    $group: {
                        _id: { $ifNull: ["$payment_mode_info.mode_name", "Unknown"] },
                        totalAmount: { $sum: "$payment_amount" },
                        id_mode: { $first: "$payment_mode_info.id_mode" },
                    }
                },
                {
                    $sort: { _id: 1 }
                },
                {
                    $project: {
                        _id: 0,
                        payment_mode: "$_id",
                        totalAmount: 1,
                        id_mode: 1
                    }
                }
            ];
        }

        pipeline.push({ $facet: facetOptions });

        const data = await paymentModel.aggregate(pipeline);

        let totalCount = 0;
        let modeWisePayments = [];
        let paginatedResults = [];

        if (data.length > 0) {
            totalCount = data[0].globalTotals[0]?.totalPaymentsCount || 0;
            paginatedResults = data[0].paginatedResults || [];

            if (limitNum <= 5) {
                let onlineAmount = 0;
                let cashAmount = 0;
                let otherAmount = 0;
                let offlineAmount = 0;

                const rawModes = data[0].modeWise || [];
                rawModes.forEach(mode => {
                    const idMode = Number(mode.id_mode);
                    const amount = Number(mode.totalAmount) || 0;

                    if (idMode === 11) {
                        onlineAmount += amount;
                    } else {
                        offlineAmount += amount;
                        if (idMode === 1) {
                            cashAmount += amount;
                        } else {
                            otherAmount += amount;
                        }
                    }
                });

                const grouped = [
                    { payment_mode: "Online", totalAmount: onlineAmount },
                    { payment_mode: "Offline", totalAmount: offlineAmount },
                    { payment_mode: "Cash", totalAmount: cashAmount },
                    { payment_mode: "Other", totalAmount: otherAmount }
                ];

                modeWisePayments = grouped.map((mode, index) => ({
                    number: index + 1,
                    ...mode
                }));
            }
        }

        const result = {
            dateRange: {
                fromDate: queryFromDate,
                toDate: queryToDate
            },
            payments: paginatedResults,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / limitNum) || 1
            }
        };

        if (limitNum <= 5) {
            result.modeWisePayments = modeWisePayments;
        }

        return result;
    }
}

export default PaymentRepo;