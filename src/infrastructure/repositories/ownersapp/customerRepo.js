import customerModel from "../../models/chit/customerModel.js";
import schemeAccountModel from "../../models/chit/schemeAccountModel.js";
import referralListModel from "../../models/chit/referralListModel.js";
import DashboardRepository from "../chit/dashboardRepository.js";

class CustomerRepo {
    constructor() {
        this.dashboardRepo = new DashboardRepository();
    }

    async getCustomers(query) {
        try {
            const branchId = query.branchId || query.branch||null;
            const fromDate = query.fromDate;
            const toDate = query.toDate;

            const baseFilter = {
                active: true,
                is_deleted: false
            };

            if (branchId && branchId !== "0") {
                baseFilter.id_branch = branchId;
            }


            let startDate, endDate;
            const hasDateFilter = !!(fromDate && toDate);

            if (hasDateFilter) {
                startDate = new Date(fromDate);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(toDate);
                endDate.setHours(23, 59, 59, 999);
            } else {
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
            }

            const duration = endDate.getTime() - startDate.getTime();
            const prevStartDate = new Date(startDate.getTime() - duration - 1);

            const calculatePercentageChange = (current, previous) => {
                if (previous === 0) {
                    return current > 0 ? 100 : 0;
                }
                return Number((((current - previous) / previous) * 100).toFixed(2));
            };


            let totalActiveCustomers, totalActiveCustomersChange;

            totalActiveCustomers = await customerModel.countDocuments(baseFilter);
            totalActiveCustomersChange = 0;


            const overdueData = await this.dashboardRepo.overdueCalculation();
            const overDue = overdueData?.totalOverdueAccounts || 0;
            const overDueChange = 0;

            const referralFilter = {
                active: true,
                is_deleted: false,
                referral_id: { $exists: true, $ne: null },
                createdAt: { $gte: prevStartDate, $lte: endDate }
            };

         

            const referralStats = await schemeAccountModel.aggregate([
                {
                    $match: referralFilter
                },
                {
                    $group: {
                        _id: null,
                        currentCount: {
                            $sum: {
                                $cond: [{ $gte: ["$createdAt", startDate] }, 1, 0]
                            }
                        },
                        prevCount: {
                            $sum: {
                                $cond: [{ $lt: ["$createdAt", startDate] }, 1, 0]
                            }
                        }
                    }
                }
            ]);

            const totalReferrals = referralStats[0]?.currentCount || 0;
            const prevReferrals = referralStats[0]?.prevCount || 0;
            const totalReferralsChange = calculatePercentageChange(totalReferrals, prevReferrals);

            return {
                totalActiveCustomers,
                totalActiveCustomersChange,
                overDue,
                overDueChange,
                totalReferrals,
                totalReferralsChange
            };

        } catch (error) {
            console.error("Error in getCustomers stats:", error);
            throw error;
        }
    }

    async findCustomer(mobile) {
        try {
            if (!mobile) {
                throw new Error("Mobile number is required");
            }

            const customers = await customerModel.aggregate([
                {
                    $match: { mobile: mobile }
                },
                {
                    $lookup: {
                        from: "schemeaccounts",
                        localField: "_id",
                        foreignField: "id_customer",
                        as: "schemeAccounts"
                    }
                },
                {
                    $unwind: {
                        path: "$schemeAccounts",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "schemes",
                        localField: "schemeAccounts.id_scheme",
                        foreignField: "_id",
                        as: "scheme"
                    }
                },
                {
                    $unwind: {
                        path: "$scheme",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "metals",
                        localField: "scheme.id_metal",
                        foreignField: "_id",
                        as: "metal"
                    }
                },
                {
                    $unwind: {
                        path: "$metal",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        customerDoc: { $first: "$$ROOT" },
                        totalAmountPaid: {
                            $sum: { $ifNull: ["$schemeAccounts.amount", 0] }
                        },
                        totalWeightPaid: {
                            $sum: { $ifNull: ["$schemeAccounts.weight", 0] }
                        },
                        activeSchemeAccounts: {
                            $sum: {
                                $cond: [{ $eq: ["$schemeAccounts.status", 0] }, 1, 0]
                            }
                        },
                        preClosedAccounts: {
                            $sum: {
                                $cond: [{ $eq: ["$schemeAccounts.status", 1] }, 1, 0]
                            }
                        },
                        goldSavings: {
                            $sum: {
                                $cond: [
                                    { $regexMatch: { input: { $ifNull: ["$metal.metal_name", ""] }, regex: /gold/i } },
                                    { $ifNull: ["$schemeAccounts.weight", 0] },
                                    0
                                ]
                            }
                        },
                        silverSavings: {
                            $sum: {
                                $cond: [
                                    { $regexMatch: { input: { $ifNull: ["$metal.metal_name", ""] }, regex: /silver/i } },
                                    { $ifNull: ["$schemeAccounts.weight", 0] },
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                "$customerDoc",
                                {
                                    totalAmountPaid: "$totalAmountPaid",
                                    totalWeightPaid: "$totalWeightPaid",
                                    activeSchemeAccounts: "$activeSchemeAccounts",
                                    preClosedAccounts: "$preClosedAccounts",
                                    goldSavings: "$goldSavings",
                                    silverSavings: "$silverSavings"
                                }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        firstname: { $ifNull: ["$firstname", ""] },
                        lastname: { $ifNull: ["$lastname", ""] },
                        mobile: { $ifNull: [{ $toString: "$mobile" }, ""] },
                        address: { $ifNull: ["$address", ""] },
                        pincode: { $ifNull: [{ $toString: "$pincode" }, ""] },
                        gender: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$gender", 1] }, then: "Male" },
                                    { case: { $eq: ["$gender", 2] }, then: "Female" },
                                    { case: { $eq: ["$gender", 3] }, then: "Other" }
                                ],
                                default: ""
                            }
                        },
                        date_of_birth: { $ifNull: ["$date_of_birth", ""] },
                        date_of_wed: { $ifNull: ["$date_of_wed", ""] },
                        whatsapp: { $ifNull: ["$whatsapp", ""] },
                        email: { $ifNull: ["$email", ""] },
                        cus_img: { $ifNull: ["$cus_img", ""] },
                        pan: { $ifNull: ["$pan", ""] },
                        aadharNumber: { $ifNull: ["$aadharNumber", ""] },
                        active: { $ifNull: ["$active", false] },
                        totalAmountPaid: { $ifNull: ["$totalAmountPaid", 0] },
                        totalWeightPaid: { $ifNull: ["$totalWeightPaid", 0] },
                        activeSchemeAccounts: { $ifNull: ["$activeSchemeAccounts", 0] },
                        preClosedAccounts: { $ifNull: ["$preClosedAccounts", 0] },
                        goldSavings: { $ifNull: ["$goldSavings", 0] },
                        silverSavings: { $ifNull: ["$silverSavings", 0] }
                    }
                }
            ]);

            return customers;
        } catch (error) {
            console.error("Error in findCustomer stats:", error);
            throw error;
        }
    }
}

export default CustomerRepo;
