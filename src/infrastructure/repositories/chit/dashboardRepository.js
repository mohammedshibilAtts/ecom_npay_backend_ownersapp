import customerModel from "../../models/chit/customerModel.js";
import paymentModel from "../../models/chit/paymentModel.js";
import schemeAccountModel from "../../models/chit/schemeAccountModel.js";
import topupModel from "../../models/chit/topupModel.js";

class DashboardRepository {
  async getAllOver(filter) {
    try {
      const openAccountFilter = { ...filter };

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      const thisMonthStartDate = new Date(currentYear, currentMonth, 1);

      const lastMonthStartDate = new Date(currentYear, currentMonth - 1, 1);
      const daysInPreviousMonth = new Date(
        currentYear,
        currentMonth,
        0,
      ).getDate();
      const targetDateNum = Math.min(
        currentDate.getDate(),
        daysInPreviousMonth,
      );
      const lastMonthEndDate = new Date(
        currentYear,
        currentMonth - 1,
        targetDateNum,
        currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds(),
        currentDate.getMilliseconds(),
      );

      const [
        totalCustomers,
        payment,
        totalAccounts,
        overdueAccounts,
        customerGrowth,
        schemeGrowth,
      ] = await Promise.all([
        customerModel.find(filter).countDocuments(),

        paymentModel.aggregate([
          { $match: { ...filter, payment_status: 1 } },

          {
            $lookup: {
              from: "schemeaccounts",
              localField: "id_scheme_account",
              foreignField: "_id",
              as: "schemeAccount",
            },
          },
          { $unwind: "$schemeAccount" },
          { $match: { "schemeAccount.status": { $nin: [4, 3] } } },

          {
            $lookup: {
              from: "schemes",
              localField: "id_scheme",
              foreignField: "_id",
              as: "Scheme",
            },
          },
          {
            $unwind: {
              path: "$Scheme",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "metals",
              localField: "Scheme.id_metal",
              foreignField: "_id",
              as: "Metal",
            },
          },
          { $unwind: { path: "$Metal", preserveNullAndEmptyArrays: true } },

          {
            $addFields: {
              includeWeight: {
                $cond: {
                  if: {
                    $and: [
                      {
                        $in: [
                          { $toLower: "$Metal.metal_name" },
                          [
                            "gold",
                            "silver",
                            "platinum",
                            "diamond",
                            "rose gold",
                          ],
                        ],
                      },
                      {
                        $not: {
                          $in: ["$Scheme.scheme_type", [0, 8, 13, 11, 1, 7]],
                        },
                      },
                    ],
                  },
                  then: "$metal_weight",
                  else: 0,
                },
              },
            },
          },

          {
            $facet: {
              overall: [
                {
                  $group: {
                    _id: null,
                    totalGoldSave: {
                      $sum: {
                        $cond: [
                          { $eq: [{ $toLower: "$Metal.metal_name" }, "gold"] },
                          "$includeWeight",
                          0,
                        ],
                      },
                    },
                    totalSilverSave: {
                      $sum: {
                        $cond: [
                          {
                            $eq: [{ $toLower: "$Metal.metal_name" }, "silver"],
                          },
                          "$includeWeight",
                          0,
                        ],
                      },
                    },
                    totalAmount: { $sum: "$payment_amount" },
                  },
                },
              ],
              thisMonth: [
                {
                  $match: {
                    createdAt: {
                      $gte: thisMonthStartDate,
                      $lte: currentDate,
                    },
                  },
                },
                {
                  $group: {
                    _id: null,
                    totalGoldSave: {
                      $sum: {
                        $cond: [
                          { $eq: [{ $toLower: "$Metal.metal_name" }, "gold"] },
                          "$includeWeight",
                          0,
                        ],
                      },
                    },
                    totalSilverSave: {
                      $sum: {
                        $cond: [
                          {
                            $eq: [{ $toLower: "$Metal.metal_name" }, "silver"],
                          },
                          "$includeWeight",
                          0,
                        ],
                      },
                    },
                    totalAmount: { $sum: "$payment_amount" },
                  },
                },
              ],
              lastMonth: [
                {
                  $match: {
                    createdAt: {
                      $gte: lastMonthStartDate,
                      $lte: lastMonthEndDate,
                    },
                  },
                },
                {
                  $group: {
                    _id: null,
                    totalGoldSave: {
                      $sum: {
                        $cond: [
                          { $eq: [{ $toLower: "$Metal.metal_name" }, "gold"] },
                          "$includeWeight",
                          0,
                        ],
                      },
                    },
                    totalSilverSave: {
                      $sum: {
                        $cond: [
                          {
                            $eq: [{ $toLower: "$Metal.metal_name" }, "silver"],
                          },
                          "$includeWeight",
                          0,
                        ],
                      },
                    },
                    totalAmount: { $sum: "$payment_amount" },
                  },
                },
              ],
            },
          },
        ]),

        schemeAccountModel.find(openAccountFilter).countDocuments(),

        schemeAccountModel.aggregate([
          { $match: openAccountFilter },
          {
            $lookup: {
              from: "schemes",
              localField: "id_scheme",
              foreignField: "_id",
              as: "Scheme",
            },
          },
          { $unwind: "$Scheme" },
          {
            $addFields: {
              daysPassed: {
                $add: [
                  {
                    $dateDiff: {
                      startDate: "$start_date",
                      endDate: new Date(),
                      unit: "day",
                    },
                  },
                  1,
                ],
              },
            },
          },
          {
            $addFields: {
              expectedInstallments: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$Scheme.installment_type", 1] },
                      then: {
                        $add: [
                          {
                            $dateDiff: {
                              startDate: "$start_date",
                              endDate: new Date(),
                              unit: "month",
                            },
                          },
                          1,
                        ],
                      },
                    },
                    {
                      case: { $eq: ["$Scheme.installment_type", 2] },
                      then: { $trunc: { $divide: ["$daysPassed", 7] } },
                    },
                    {
                      case: { $eq: ["$Scheme.installment_type", 3] },
                      then: "$daysPassed",
                    },
                    {
                      case: { $eq: ["$Scheme.installment_type", 4] },
                      then: {
                        $add: [
                          {
                            $dateDiff: {
                              startDate: "$start_date",
                              endDate: new Date(),
                              unit: "year",
                            },
                          },
                          1,
                        ],
                      },
                    },
                  ],
                  default: 0,
                },
              },
            },
          },
          {
            $addFields: {
              installmentDue: {
                $max: [
                  {
                    $subtract: ["$expectedInstallments", "$paid_installments"],
                  },
                  0,
                ],
              },
            },
          },
          { $match: { installmentDue: { $gt: 0 } } },
          {
            $facet: {
              overall: [{ $count: "count" }],
              thisMonth: [
                {
                  $match: {
                    createdAt: {
                      $gte: thisMonthStartDate,
                      $lte: currentDate,
                    },
                  },
                },
                { $count: "count" },
              ],
              lastMonth: [
                {
                  $match: {
                    createdAt: {
                      $gte: lastMonthStartDate,
                      $lte: lastMonthEndDate,
                    },
                  },
                },
                { $count: "count" },
              ],
            },
          },
        ]),

        customerModel.aggregate([
          { $match: filter },
          {
            $facet: {
              thisMonth: [
                {
                  $match: {
                    createdAt: {
                      $gte: thisMonthStartDate,
                      $lte: currentDate,
                    },
                  },
                },
                { $count: "count" },
              ],
              lastMonth: [
                {
                  $match: {
                    createdAt: {
                      $gte: lastMonthStartDate,
                      $lte: lastMonthEndDate,
                    },
                  },
                },
                { $count: "count" },
              ],
            },
          },
          {
            $project: {
              thisMonthCount: {
                $ifNull: [{ $arrayElemAt: ["$thisMonth.count", 0] }, 0],
              },
              lastMonthCount: {
                $ifNull: [{ $arrayElemAt: ["$lastMonth.count", 0] }, 0],
              },
            },
          },
          {
            $addFields: {
              increase: { $gte: ["$thisMonthCount", "$lastMonthCount"] },
              percentage: {
                $cond: {
                  if: { $eq: ["$lastMonthCount", 0] },
                  then: {
                    $cond: {
                      if: { $gt: ["$thisMonthCount", 0] },
                      then: 100,
                      else: 0,
                    },
                  },
                  else: {
                    $min: [
                      {
                        $round: [
                          {
                            $abs: {
                              $multiply: [
                                {
                                  $divide: [
                                    {
                                      $subtract: [
                                        "$thisMonthCount",
                                        "$lastMonthCount",
                                      ],
                                    },
                                    "$lastMonthCount",
                                  ],
                                },
                                100,
                              ],
                            },
                          },
                          2,
                        ],
                      },
                      100,
                    ],
                  },
                },
              },
            },
          },
        ]),

        schemeAccountModel.aggregate([
          { $match: filter },
          {
            $facet: {
              thisMonth: [
                {
                  $match: {
                    createdAt: {
                      $gte: thisMonthStartDate,
                      $lte: currentDate,
                    },
                  },
                },
                { $count: "count" },
              ],
              lastMonth: [
                {
                  $match: {
                    createdAt: {
                      $gte: lastMonthStartDate,
                      $lte: lastMonthEndDate,
                    },
                  },
                },
                { $count: "count" },
              ],
            },
          },
          {
            $project: {
              thisMonthCount: {
                $ifNull: [{ $arrayElemAt: ["$thisMonth.count", 0] }, 0],
              },
              lastMonthCount: {
                $ifNull: [{ $arrayElemAt: ["$lastMonth.count", 0] }, 0],
              },
            },
          },
          {
            $addFields: {
              increase: { $gte: ["$thisMonthCount", "$lastMonthCount"] },
              percentage: {
                $cond: {
                  if: { $eq: ["$lastMonthCount", 0] },
                  then: {
                    $cond: {
                      if: { $gt: ["$thisMonthCount", 0] },
                      then: 100,
                      else: 0,
                    },
                  },
                  else: {
                    $min: [
                      {
                        $round: [
                          {
                            $abs: {
                              $multiply: [
                                {
                                  $divide: [
                                    {
                                      $subtract: [
                                        "$thisMonthCount",
                                        "$lastMonthCount",
                                      ],
                                    },
                                    "$lastMonthCount",
                                  ],
                                },
                                100,
                              ],
                            },
                          },
                          2,
                        ],
                      },
                      100,
                    ],
                  },
                },
              },
            },
          },
        ]),
      ]);

      const paymentData = payment[0] || {};
      const paymentOverall = paymentData.overall?.[0] || {};
      const paymentThisMonth = paymentData.thisMonth?.[0] || {};
      const paymentLastMonth = paymentData.lastMonth?.[0] || {};

      const overdueData = overdueAccounts[0] || {};
      const overdueOverall = overdueData.overall?.[0]?.count || 0;
      const overdueThisMonth = overdueData.thisMonth?.[0]?.count || 0;
      const overdueLastMonth = overdueData.lastMonth?.[0]?.count || 0;

      const growth = customerGrowth[0] || { increase: false, percentage: 0 };
      const schemeAccountGrowth = schemeGrowth[0] || {
        increase: false,
        percentage: 0,
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

      return {
        totalAccounts,
        totalCustomers,
        totalGoldSave: paymentOverall.totalGoldSave || 0,
        totalSilverSave: paymentOverall.totalSilverSave || 0,
        totalAmount: paymentOverall.totalAmount || 0,
        overdueAccounts: overdueOverall,
        customerGrowth: {
          increase: growth.increase ?? false,
          percentage: growth.percentage ?? 0,
        },
        schemeAccountGrowth: {
          increase: schemeAccountGrowth.increase ?? false,
          percentage: schemeAccountGrowth.percentage ?? 0,
        },
        goldGrowth: calculateGrowth(
          paymentThisMonth.totalGoldSave || 0,
          paymentLastMonth.totalGoldSave || 0,
        ),
        silverGrowth: calculateGrowth(
          paymentThisMonth.totalSilverSave || 0,
          paymentLastMonth.totalSilverSave || 0,
        ),
        amountGrowth: calculateGrowth(
          paymentThisMonth.totalAmount || 0,
          paymentLastMonth.totalAmount || 0,
        ),
        overdueGrowth: calculateGrowth(overdueThisMonth, overdueLastMonth),
      };
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching dashboard data");
    }
  }

  async getInsightsData(filter, isYearly, isMonthly) {
    try {
      if (isYearly) {
        const yearlyData = await paymentModel.aggregate([
          {
            $match: {
              ...filter,
              payment_status: 1,
            },
          },
          {
            $lookup: {
              from: "schemeaccounts",
              localField: "id_scheme_account",
              foreignField: "_id",
              as: "schemeAccount",
            },
          },
          { $unwind: "$schemeAccount" },
          {
            $match: {
              "schemeAccount.status": { $nin: [3, 4] },
            },
          },
          {
            $group: {
              _id: { $year: "$createdAt" },
              totalAmount: { $sum: "$payment_amount" },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]);

        let totalAmount = 0;
        const graphData = yearlyData.map((item) => {
          totalAmount += item.totalAmount || 0;
          return {
            name: item._id ? item._id.toString() : "Unknown",
            amount: item.totalAmount || 0,
          };
        });

        let percentage = 0;
        let isIncrease = true;

        if (graphData.length >= 2) {
          const currentYearAmount = graphData[graphData.length - 1].amount;
          const previousYearAmount = graphData[graphData.length - 2].amount;

          if (previousYearAmount === 0) {
            percentage = currentYearAmount > 0 ? 100 : 0;
            isIncrease = true;
          } else {
            const diff = currentYearAmount - previousYearAmount;
            percentage = Math.min(
              Math.round(Math.abs((diff / previousYearAmount) * 100) * 100) /
                100,
              100,
            );
            isIncrease = diff >= 0;
          }
        } else if (graphData.length === 1) {
          percentage = 100;
          isIncrease = true;
        }

        return {
          totalAmount,
          percentageChange: percentage,
          isIncrease,
          graphData,
        };
      } else {
        // Monthly Logic (Current Year)
        const targetYear = new Date().getFullYear();
        const startOfCurrentYear = new Date(targetYear, 0, 1);
        const endOfCurrentYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);

        const startOfPreviousYear = new Date(targetYear - 1, 0, 1);
        const endOfPreviousYear = new Date(
          targetYear - 1,
          11,
          31,
          23,
          59,
          59,
          999,
        );

        const [currentYearData, previousYearData] = await Promise.all([
          paymentModel.aggregate([
            {
              $match: {
                ...filter,
                payment_status: 1,
                createdAt: {
                  $gte: startOfCurrentYear,
                  $lte: endOfCurrentYear,
                },
              },
            },
            {
              $lookup: {
                from: "schemeaccounts",
                localField: "id_scheme_account",
                foreignField: "_id",
                as: "schemeAccount",
              },
            },
            { $unwind: "$schemeAccount" },
            {
              $match: {
                "schemeAccount.status": { $nin: [3, 4] },
              },
            },
            {
              $group: {
                _id: { $month: "$createdAt" },
                totalAmount: { $sum: "$payment_amount" },
              },
            },
          ]),
          paymentModel.aggregate([
            {
              $match: {
                ...filter,
                payment_status: 1,
                createdAt: {
                  $gte: startOfPreviousYear,
                  $lte: endOfPreviousYear,
                },
              },
            },
            {
              $lookup: {
                from: "schemeaccounts",
                localField: "id_scheme_account",
                foreignField: "_id",
                as: "schemeAccount",
              },
            },
            { $unwind: "$schemeAccount" },
            {
              $match: {
                "schemeAccount.status": { $nin: [3, 4] },
              },
            },
            {
              $group: {
                _id: { $month: "$createdAt" },
                totalAmount: { $sum: "$payment_amount" },
              },
            },
          ]),
        ]);

        const monthlyData = Array(12).fill(0);
        let currentYearTotal = 0;

        currentYearData.forEach((item) => {
          if (item._id) {
            const monthIndex = item._id - 1; // MongoDB $month returns 1-12
            monthlyData[monthIndex] = item.totalAmount || 0;
          }
          currentYearTotal += item.totalAmount || 0;
        });

        const previousMonthlyData = Array(12).fill(0);
        previousYearData.forEach((item) => {
          if (item._id) {
            const monthIndex = item._id - 1;
            previousMonthlyData[monthIndex] = item.totalAmount || 0;
          }
        });

        // Month-over-Month comparison
        const currentMonthIndex = new Date().getMonth();
        const currentMonthAmount = monthlyData[currentMonthIndex];
        const previousMonthAmount =
          currentMonthIndex === 0
            ? previousMonthlyData[11]
            : monthlyData[currentMonthIndex - 1];

        let percentage = 0;
        let isIncrease = true;

        if (previousMonthAmount === 0) {
          percentage = currentMonthAmount > 0 ? 100 : 0;
          isIncrease = true;
        } else {
          const diff = currentMonthAmount - previousMonthAmount;
          percentage = Math.min(
            Math.round(Math.abs((diff / previousMonthAmount) * 100) * 100) /
              100,
            100,
          );
          isIncrease = diff >= 0;
        }

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const graphData = monthNames.map((name, index) => ({
          name,
          amount: monthlyData[index],
        }));

        return {
          totalAmount: currentYearTotal,
          percentageChange: percentage,
          isIncrease: isIncrease,
          graphData: graphData,
        };
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching insights data");
    }
  }

  async overdueCalculation() {
    try {
      const result = await schemeAccountModel.aggregate([
        {
          $match: {
            status: 0,
            active: true,
            is_deleted: false,
          },
        },
        {
          $lookup: {
            from: "schemes",
            localField: "id_scheme",
            foreignField: "_id",
            as: "scheme",
          },
        },
        { $unwind: "$scheme" },


        {
          $addFields: {
            currentDate: new Date(),
            startDateObj: "$start_date",
            schemeInstallmentType: "$scheme.installment_type",
          },
        },
        {
          $addFields: {
            expectedDueDates: {
              $let: {
                vars: {
                  startDate: "$startDateObj",
                  totalInstallments: "$total_installments",
                  installmentType: "$schemeInstallmentType",
                },
                in: {
                  $map: {
                    input: { $range: [0, "$$totalInstallments"] },
                    as: "i",
                    in: {
                      $dateAdd: {
                        startDate: "$$startDate",
                        unit: {
                          $switch: {
                            branches: [
                              {
                                case: { $eq: ["$$installmentType", 1] },
                                then: "month",
                              },
                              {
                                case: { $eq: ["$$installmentType", 2] },
                                then: "week",
                              },
                              {
                                case: { $eq: ["$$installmentType", 3] },
                                then: "day",
                              },
                              {
                                case: { $eq: ["$$installmentType", 4] },
                                then: "year",
                              },
                            ],
                            default: "month",
                          },
                        },
                        amount: "$$i",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $addFields: {
            expectedInstallmentCount: {
              $size: {
                $filter: {
                  input: "$expectedDueDates",
                  as: "dueDate",
                  cond: { $lte: ["$$dueDate", "$currentDate"] },
                },
              },
            },
          },
        },
        {
          $addFields: {
            overdueInstallments: {
              $cond: {
                if: {
                  $gt: ["$expectedInstallmentCount", "$paid_installments"],
                },
                then: {
                  $subtract: [
                    "$expectedInstallmentCount",
                    "$paid_installments",
                  ],
                },
                else: 0,
              },
            },
          },
        },
        {
          $match: {
            overdueInstallments: { $gt: 0 },
          },
        },
        {
          $count: "totalOverdueAccounts",
        },
      ]);

      const count = result.length > 0 ? result[0].totalOverdueAccounts : 0;
      return { totalOverdueAccounts: count };
    } catch (error) {
      console.error("Error in overdueCalculation:", error);
      throw error;
    }
  }

  async getAccountStat(customFilter) {
    try {
      const baseFilter = { ...customFilter };
      delete baseFilter.createdAt;

      let thisPeriodStart, thisPeriodEnd;
      let lastPeriodStart, lastPeriodEnd;

      if (
        customFilter.createdAt &&
        customFilter.createdAt.$gte &&
        customFilter.createdAt.$lte
      ) {
        thisPeriodStart = new Date(customFilter.createdAt.$gte);
        thisPeriodEnd = new Date(customFilter.createdAt.$lte);
        const duration = thisPeriodEnd.getTime() - thisPeriodStart.getTime();
        lastPeriodStart = new Date(thisPeriodStart.getTime() - duration);
        lastPeriodEnd = new Date(thisPeriodStart.getTime() - 1);
      } else {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        thisPeriodStart = new Date(currentYear, currentMonth, 1);
        thisPeriodEnd = currentDate;

        lastPeriodStart = new Date(currentYear, currentMonth - 1, 1);
        const daysInPreviousMonth = new Date(
          currentYear,
          currentMonth,
          0,
        ).getDate();
        const targetDateNum = Math.min(
          currentDate.getDate(),
          daysInPreviousMonth,
        );
        lastPeriodEnd = new Date(
          currentYear,
          currentMonth - 1,
          targetDateNum,
          currentDate.getHours(),
          currentDate.getMinutes(),
          currentDate.getSeconds(),
          currentDate.getMilliseconds(),
        );
      }

      const topLevelDateFilter = customFilter.createdAt
        ? { createdAt: { $gte: lastPeriodStart, $lte: thisPeriodEnd } }
        : {};

      const overallMatch = customFilter.createdAt
        ? [
            {
              $match: {
                createdAt: { $gte: thisPeriodStart, $lte: thisPeriodEnd },
              },
            },
          ]
        : [];
      const thisPeriodMatch = [
        {
          $match: { createdAt: { $gte: thisPeriodStart, $lte: thisPeriodEnd } },
        },
      ];
      const lastPeriodMatch = [
        {
          $match: { createdAt: { $gte: lastPeriodStart, $lte: lastPeriodEnd } },
        },
      ];

      const [customerData, paymentData, schemeData] = await Promise.all([
        customerModel.aggregate([
          { $match: { ...baseFilter, ...topLevelDateFilter } },
          {
            $facet: {
              overall: [...overallMatch, { $count: "count" }],
              thisPeriod: [...thisPeriodMatch, { $count: "count" }],
              lastPeriod: [...lastPeriodMatch, { $count: "count" }],
            },
          },
        ]),

        paymentModel.aggregate([
          {
            $match: { ...baseFilter, ...topLevelDateFilter, payment_status: 1 },
          },

          {
            $lookup: {
              from: "schemeaccounts",
              localField: "id_scheme_account",
              foreignField: "_id",
              as: "schemeAccount",
            },
          },
          { $unwind: "$schemeAccount" },
          {
            $lookup: {
              from: "closedbills",
              let: {
                schemeAccountId: "$schemeAccount._id",
                schemeStatus: "$schemeAccount.status",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$id_scheme_account", "$$schemeAccountId"] },
                        { $in: ["$$schemeStatus", [3, 4]] },
                        ...(customFilter.createdAt
                          ? [
                              { $gte: ["$createdAt", thisPeriodStart] },
                              { $lte: ["$createdAt", thisPeriodEnd] },
                            ]
                          : []),
                      ],
                    },
                  },
                },
              ],
              as: "closedBill",
            },
          },
          {
            $match: {
              $expr: {
                $or: [
                  { $not: [{ $in: ["$schemeAccount.status", [3, 4]] }] },
                  { $eq: [{ $size: "$closedBill" }, 0] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "schemes",
              localField: "schemeAccount.id_scheme",
              foreignField: "_id",
              as: "scheme",
            },
          },
          { $unwind: { path: "$scheme", preserveNullAndEmptyArrays: false } },

          {
            $addFields: {
              safeMetalWeight: {
                $cond: {
                  if: {
                    $or: [
                      { $eq: ["$metal_weight", Infinity] },
                      { $eq: ["$metal_weight", -Infinity] },
                    ],
                  },
                  then: 0,
                  else: { $ifNull: ["$metal_weight", 0] },
                },
              },
              safePaymentAmount: { $ifNull: ["$payment_amount", 0] },
            },
          },

          {
            $addFields: {
              includeWeight: {
                $cond: {
                  if: {
                    $not: {
                      $in: ["$scheme.scheme_type", [0, 8, 13, 11, 1, 7]],
                    },
                  },
                  then: "$safeMetalWeight",
                  else: 0,
                },
              },
            },
          },
          {
            $facet: {
              overall: [
                ...overallMatch,
                {
                  $group: {
                    _id: null,
                    totalMetalWeight: { $sum: "$includeWeight" },
                    totalIncludeWeight: { $sum: "$includeWeight" },
                    totalAmount: { $sum: "$safePaymentAmount" },
                  },
                },
              ],
              thisPeriod: [
                ...thisPeriodMatch,
                {
                  $group: {
                    _id: null,
                    totalMetalWeight: { $sum: "$includeWeight" },
                    totalIncludeWeight: { $sum: "$includeWeight" },
                    totalAmount: { $sum: "$safePaymentAmount" },
                  },
                },
              ],
              lastPeriod: [
                ...lastPeriodMatch,
                {
                  $group: {
                    _id: null,
                    totalMetalWeight: { $sum: "$includeWeight" },
                    totalIncludeWeight: { $sum: "$includeWeight" },
                    totalAmount: { $sum: "$safePaymentAmount" },
                  },
                },
              ],
            },
          },
        ]),

        schemeAccountModel.aggregate([
          {
            $match: {
              ...baseFilter,
              ...topLevelDateFilter,
              status: { $nin: [4, 3] },
            },
          },
          {
            $facet: {
              totalAccounts_overall: [...overallMatch, { $count: "count" }],
              completedAccounts_overall: [
                ...overallMatch,
                { $match: { status: 2 } },
                { $count: "count" },
              ],
              closedAccounts_overall: [
                ...overallMatch,
                { $match: { status: 1 } },
                { $count: "count" },
              ],
              totalAccounts_thisPeriod: [
                ...thisPeriodMatch,
                { $count: "count" },
              ],
              completedAccounts_thisPeriod: [
                ...thisPeriodMatch,
                { $match: { status: 2 } },
                { $count: "count" },
              ],
              closedAccounts_thisPeriod: [
                ...thisPeriodMatch,
                { $match: { status: 1 } },
                { $count: "count" },
              ],
              totalAccounts_lastPeriod: [
                ...lastPeriodMatch,
                { $count: "count" },
              ],
              completedAccounts_lastPeriod: [
                ...lastPeriodMatch,
                { $match: { status: 2 } },
                { $count: "count" },
              ],
              closedAccounts_lastPeriod: [
                ...lastPeriodMatch,
                { $match: { status: 1 } },
                { $count: "count" },
              ],
            },
          },
        ]),
      ]);

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

      const custData = customerData[0] || {};
      const newCustomer = custData.overall?.[0]?.count || 0;
      const customerThisPeriod = custData.thisPeriod?.[0]?.count || 0;
      const customerLastPeriod = custData.lastPeriod?.[0]?.count || 0;

      const payData = paymentData[0] || {};
      const payOverall = payData.overall?.[0] || {};
      const payThisPeriod = payData.thisPeriod?.[0] || {};
      const payLastPeriod = payData.lastPeriod?.[0] || {};

      const schData = schemeData[0] || {};
      const newAccounts = schData.totalAccounts_overall?.[0]?.count || 0;
      const completedAccounts =
        schData.completedAccounts_overall?.[0]?.count || 0;
      const closedAccounts = schData.closedAccounts_overall?.[0]?.count || 0;

      return {
        newCustomer: newCustomer,
        receivedWeights: payOverall.totalMetalWeight || 0,
        receivedAmounts: payOverall.totalAmount || 0,
        newAccounts: newAccounts,
        completedAccount: completedAccounts,
        closedAccount: closedAccounts,

        newCustomerGrowth: calculateGrowth(
          customerThisPeriod,
          customerLastPeriod,
        ),
        weightGrowth: calculateGrowth(
          payThisPeriod.totalMetalWeight || 0,
          payLastPeriod.totalMetalWeight || 0,
        ),
        amountGrowth: calculateGrowth(
          payThisPeriod.totalAmount || 0,
          payLastPeriod.totalAmount || 0,
        ),
        newAccountsGrowth: calculateGrowth(
          schData.totalAccounts_thisPeriod?.[0]?.count || 0,
          schData.totalAccounts_lastPeriod?.[0]?.count || 0,
        ),
        completedAccountGrowth: calculateGrowth(
          schData.completedAccounts_thisPeriod?.[0]?.count || 0,
          schData.completedAccounts_lastPeriod?.[0]?.count || 0,
        ),
        closedAccountGrowth: calculateGrowth(
          schData.closedAccounts_thisPeriod?.[0]?.count || 0,
          schData.closedAccounts_lastPeriod?.[0]?.count || 0,
        ),
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getAccountData(customFilter) {
    try {
      const result = await schemeAccountModel.aggregate([
        { $match: customFilter },
        {
          $lookup: {
            from: "schemes",
            localField: "id_scheme",
            foreignField: "_id",
            as: "Scheme",
          },
        },
        { $unwind: "$Scheme" },

        {
          $facet: {
            totalAccounts: [{ $count: "count" }],

            digiGoldAccounts: [
              { $match: { "Scheme.scheme_type": 10 } },
              { $count: "count" },
            ],

            digiSilverAccounts: [
              { $match: { "Scheme.scheme_type": 11 } },
              { $count: "count" },
            ],

            openAccounts: [{ $match: { status: 0 } }, { $count: "count" }],

            closeAccounts: [{ $match: { status: 1 } }, { $count: "count" }],

            completedAccounts: [{ $match: { status: 2 } }, { $count: "count" }],

            preclosedAccounts: [{ $match: { status: 3 } }, { $count: "count" }],

            refundAccounts: [{ $match: { status: 4 } }, { $count: "count" }],
          },
        },

        // Flatten all results with default 0 if no data
        {
          $project: {
            totalAccounts: {
              $ifNull: [{ $arrayElemAt: ["$totalAccounts.count", 0] }, 0],
            },
            digiGoldAccounts: {
              $ifNull: [{ $arrayElemAt: ["$digiGoldAccounts.count", 0] }, 0],
            },
            digiSilverAccounts: {
              $ifNull: [{ $arrayElemAt: ["$digiSilverAccounts.count", 0] }, 0],
            },
            openAccounts: {
              $ifNull: [{ $arrayElemAt: ["$openAccounts.count", 0] }, 0],
            },
            closeAccounts: {
              $ifNull: [{ $arrayElemAt: ["$closeAccounts.count", 0] }, 0],
            },
            completedAccounts: {
              $ifNull: [{ $arrayElemAt: ["$completedAccounts.count", 0] }, 0],
            },
            preclosedAccounts: {
              $ifNull: [{ $arrayElemAt: ["$preclosedAccounts.count", 0] }, 0],
            },
            refundAccounts: {
              $ifNull: [{ $arrayElemAt: ["$refundAccounts.count", 0] }, 0],
            },
          },
        },
      ]);

      return result[0];
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching dashboard data");
    }
  }

  async paymentReportEdger(filter, skip, pageSize) {
    try {
      const allPaymentModes = await paymentModel.db
        .collection("paymentmodes")
        .find({})
        .toArray();

      const paymentData = await paymentModel.aggregate([
        {
          $match: filter,
        },

        {
          $lookup: {
            from: "paymentmodes",
            localField: "payment_mode",
            foreignField: "_id",
            as: "PaymentData",
          },
        },
        { $unwind: { path: "$PaymentData", preserveNullAndEmptyArrays: true } },

        {
          $addFields: {
            total_amt: { $ifNull: ["$total_amt", 0] },
          },
        },

        {
          $group: {
            _id: "$PaymentData._id",
            mode_name: { $first: "$PaymentData.mode_name" },
            totalAmount: { $sum: "$total_amt" },
          },
        },
      ]);

      const mergedData = allPaymentModes.map((mode) => {
        const found = paymentData.find(
          (data) => String(data._id) === String(mode._id),
        );
        return {
          _id: mode._id,
          mode_name: mode.mode_name,
          totalAmount: found ? found.totalAmount : 0,
        };
      });

      // Pagination details
      const totalDocuments = mergedData.length;
      const totalPages = Math.ceil(totalDocuments / pageSize);
      const currentPage = Math.floor(skip / pageSize) + 1;

      const paginatedData = mergedData.slice(skip, skip + pageSize);
      return {
        data: paginatedData,
        totalDocuments,
        totalPages,
        currentPage,
      };
    } catch (err) {
      throw err;
    }
  }

  async getPaymentHistory(skip, pageSize, filter, search) {
    try {
      const pipeline = [
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "customers", // collection name
            localField: "id_customer",
            foreignField: "_id",
            as: "id_customer",
          },
        },
        { $unwind: { path: "$id_customer", preserveNullAndEmptyArrays: true } },
      ];

      if (search) {
        const searchRegex = { $regex: search, $options: "i" };
        pipeline.push({
          $match: {
            $or: [
              { id_transaction: searchRegex },
              { payment_receipt: searchRegex },
              { "id_customer.firstname": searchRegex },
              { "id_customer.lastname": searchRegex },
              { "id_customer.mobile": searchRegex },
            ],
          },
        });
      }

      pipeline.push(
        {
          $sort: { createdAt: -1 },
        },
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: pageSize },
              {
                $lookup: {
                  from: "schemes",
                  localField: "id_scheme",
                  foreignField: "_id",
                  as: "id_scheme",
                },
              },
              {
                $unwind: {
                  path: "$id_scheme",
                  preserveNullAndEmptyArrays: true,
                },
              },

              {
                $lookup: {
                  from: "metals",
                  localField: "id_scheme.id_metal",
                  foreignField: "_id",
                  as: "metal",
                },
              },
              { $unwind: { path: "$metal", preserveNullAndEmptyArrays: true } },

              // Lookup purity
              {
                $lookup: {
                  from: "purities",
                  localField: "id_scheme.id_purity",
                  foreignField: "_id",
                  as: "purity",
                },
              },
              {
                $unwind: { path: "$purity", preserveNullAndEmptyArrays: true },
              },

              // Project (🔥 Fully customizable output)
              {
                $project: {
                  _id: 1,
                  amount: 1,
                  createdAt: 1,
                  status: 1,
                  id_transaction: 1,
                  paymentModeName: 1,
                  payment_amount: 1,
                  payment_status: 1,
                  metal_weight: 1,
                  payment_receipt: 1,
                  id_customer: {
                    _id: "$id_customer._id",
                    firstname: "$id_customer.firstname",
                    lastname: "$id_customer.lastname",
                    mobile: "$id_customer.mobile",
                  },

                  id_scheme: {
                    _id: "$id_scheme._id",
                    scheme_name: "$id_scheme.scheme_name",
                    id_metal: {
                      _id: "$metal._id",
                      metal_name: "$metal.metal_name",
                      id_metal: "$metal.id_metal",
                    },
                    id_purity: {
                      _id: "$purity._id",
                      purity_name: "$purity.purity_name",
                    },
                  },
                },
              },
            ],

            total: [{ $count: "count" }],
          },
        },
      );

      const data = await paymentModel.aggregate(pipeline);

      return {
        data: data[0].data,
        total: data[0].total[0]?.count || 0,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getNotificationCount(id_branch) {
    try {
      // const count =
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async paymentModeData(filter) {
    try {
      const { fromDate, toDate, ...matchFilter } = filter;

      const data = await paymentModel.aggregate([
        {
          $match: {
            ...matchFilter,
            payment_status: 1,
          },
        },
        {
          $lookup: {
            from: "schemeaccounts",
            localField: "id_scheme_account",
            foreignField: "_id",
            as: "schemeAccount",
          },
        },
        { $unwind: "$schemeAccount" },
        {
          $lookup: {
            from: "closedbills",
            let: {
              schemeAccountId: "$schemeAccount._id",
              schemeStatus: "$schemeAccount.status",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$id_scheme_account", "$$schemeAccountId"] },
                      { $in: ["$$schemeStatus", [3, 4]] },
                      { $gte: ["$createdAt", new Date(fromDate)] },
                      { $lte: ["$createdAt", new Date(toDate)] },
                    ],
                  },
                },
              },
            ],
            as: "closedBill",
          },
        },
        {
          $match: {
            $expr: {
              $or: [
                { $not: [{ $in: ["$schemeAccount.status", [3, 4]] }] },
                { $eq: [{ $size: "$closedBill" }, 0] },
              ],
            },
          },
        },
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
        },
        {
          $group: {
            _id: "$payment_mode_info.mode_name",
            totalAmount: { $sum: "$payment_amount" },
          },
        },
        {
          $project: {
            _id: 0,
            payment_mode: "$_id",
            totalAmount: 1,
          },
        },
      ]);

      return data;
    } catch (err) {
      throw err;
    }
  }
}

export default DashboardRepository;
