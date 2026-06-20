import mongoose from "mongoose";
import schemeAccountModel from "../../models/chit/schemeAccountModel.js";

class SchemeAccountRepository {
  async findById(id) {
    try {
      const data = await schemeAccountModel.findById(id)
        .populate("id_scheme")

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(query) {
    try {
      const data = await schemeAccountModel.findOne(query);

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  }


  async find(query) {
    try {
      const data = await schemeAccountModel
        .find(query)
        .populate({
          path: "id_customer",
          select: "_id mobile firstname lastname address",
        })
        .populate("id_scheme")
        .lean();

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getSchemeAccountById(id) {
    try {
      const data = await schemeAccountModel
        .findById(id)
        .populate({
          path: "id_scheme",
        })
        .populate("id_customer")
        .populate("id_classification")
        .populate("id_branch", "name")
        .lean();

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateQty(id, qty) {
    try {
      const updatedData = await schemeAccountModel.updateOne(
        { _id: id },
        { $inc: { gift_issues: qty } }
      );

      if (!updatedData) {
        return null;
      }

      return updatedData;
    } catch (error) {
      console.error(error);
      throw new Error("Database error in Updating qty");
    }
  }

  async updateOne(id, data) {
    try {
      const updatedData = await schemeAccountModel.updateOne(
        { _id: id },
        { $set: data }
      );

      if (updatedData.matchedCount === 0) {
        return null;
      }

      return updatedData;
    } catch (error) {
      console.error(error);
    }
  }

  async getCustomerAccount(query) {
    try {
      const data = await schemeAccountModel.aggregate([
        { $match: query },
        { $sort: { _id: -1 } },
        {
          $lookup: {
            from: "schemes",
            localField: "id_scheme",
            foreignField: "_id",
            as: "id_scheme"
          }
        },
        { $unwind: { path: "$id_scheme", preserveNullAndEmptyArrays: false } },
        {
          $lookup: {
            from: "metalrates",
            let: {
              metalId: "$id_scheme.id_metal",
              purityId: "$id_scheme.id_purity"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$material_type_id", "$$metalId"] },
                      { $eq: ["$purity_id", "$$purityId"] }
                    ]
                  }
                }
              },
              { $sort: { createdAt: -1 } },
              { $limit: 1 }
            ],
            as: "metalrate"
          }
        },
        { $unwind: { path: "$metalrate", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "id_scheme_account",
            as: "payments"
          }
        },
        {
          $lookup: {
            from: "payments",
            let: { accId: "$_id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$id_scheme_account", "$$accId"] }, { $eq: ["$active", true] }] } } },
              { $sort: { date_payment: 1 } },
              { $limit: 1 }
            ],
            as: "firstPayment"
          }
        },
        { $unwind: { path: "$firstPayment", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "payments",
            let: { accId: "$_id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$id_scheme_account", "$$accId"] }, { $eq: ["$active", true] }, { $eq: ["$payment_status", 1] }] } } },
              {
                $group: {
                  _id: null,
                  total_installments: { $sum: "$paid_installments" }
                }
              }
            ],
            as: "paymentCalc"
          }
        },
        { $unwind: { path: "$paymentCalc", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            total_metal_weight: {
              $sum: {
                $map: {
                  input: "$payments",
                  as: "p",
                  in: { $ifNull: ["$$p.metal_weight", 0] }
                }
              }
            },
            metalRate: "$metalrate.rate",
            lockedAmount: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$id_scheme.dynamicAmount", true] },
                    { $eq: ["$paymentCalc.total_installments", 10] },
                    { $gt: [{ $ifNull: ["$firstPayment.paid_installments", 0] }, 0] }
                  ]
                },
                then: { $divide: ["$firstPayment.payment_amount", "$firstPayment.paid_installments"] },
                else: 0
              }
            },
            overdueIn: {
              $let: {
                vars: {
                  expected: {
                    $min: [
                      { $ifNull: ["$total_installments", 0] },
                      {
                        $max: [
                          0,
                          {
                            $dateDiff: {
                              startDate: { $ifNull: ["$start_date", "$$NOW"] },
                              endDate: "$$NOW",
                              unit: {
                                $switch: {
                                  branches: [
                                    { case: { $eq: ["$id_scheme.installment_type", 1] }, then: "month" },
                                    { case: { $eq: ["$id_scheme.installment_type", 2] }, then: "week" },
                                    { case: { $eq: ["$id_scheme.installment_type", 3] }, then: "day" },
                                    { case: { $eq: ["$id_scheme.installment_type", 4] }, then: "year" }
                                  ],
                                  default: "month"
                                }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  }
                },
                in: {
                  $max: [0, { $subtract: ["$$expected", { $ifNull: ["$paymentCalc.total_installments", 0] }] }]
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: "schemestatuses",
            localField: "status",
            foreignField: "id_status",
            as: "schemestatuses"
          }
        },
        { $unwind: { path: "$schemestatuses", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            statusName: "$schemestatuses"
          }
        },
        {
          $addFields: {
            scheme_acc_number: { $ifNull: ["$scheme_acc_number", "Not Allocated"] },
            firstPaidAmount: "$firstPayment.payment_amount",
            "id_scheme.min_amount": {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$id_scheme.dynamicAmount", true] },
                    { $gt: ["$firstPayment.payment_amount", 0] }
                  ]
                },
                then: "$firstPayment.payment_amount",
                else: "$id_scheme.min_amount"
              }
            }
          }
        },
        {
          $project: {
            payments: 0,
            schemestatuses: 0,
            metalrate: 0,
            firstPayment: 0,
            paymentCalc: 0
          }
        }
      ]);

      return data;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async editSchemeAccount(id, data) {
    try {
      const updatedData = await schemeAccountModel.updateOne(
        { _id: id },
        { $set: data }
      );

      if (updatedData.modifiedCount === 0) {
        return null;
      }

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteSchemeAccount(id) {
    try {
      const updatedData = await schemeAccountModel.updateOne(
        { _id: id },
        { $set: { is_deleted: true, active: false } }
      );

      if (updatedData.modifiedCount === 0) {
        return null;
      }

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async activateSchemeAccount(id, active) {
    try {
      const updatedData = await schemeAccountModel.updateOne(
        { _id: id },
        { $set: { active: !active } }
      );

      if (updatedData.modifiedCount === 0) {
        return null;
      }

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async addSchemeAccount(data) {
    try {
      const savedData = await schemeAccountModel.create(data);

      return savedData ? savedData : null;
    } catch (error) {
      console.error(error);
      throw new Error("Database error : add scheme account");
    }
  }

  async updatePaymentCount({ schemeAccountId, paymentcount, last_paid_date, paid_installments, status = null }) {
    try {
      const newData = {
        paymentcount,
        last_paid_date,
        paid_installments,
      };

      if (status != null) {
        newData.status = status;
      }

      const updatedPayments = await schemeAccountModel.findByIdAndUpdate(
        schemeAccountId,
        {
          $set: newData
        },
        { new: true }
      );

      return updatedPayments || null;
    } catch (error) {
      console.error("Error updating payment count:", error);
      throw error;
    }
  }

  async countDocuments(filter) {
    try {
      const docCount = await schemeAccountModel.countDocuments(filter);

      return docCount ? docCount : null;
    } catch (error) {
      console.error(error);
      throw new Error("Database error : add scheme account");
    }
  }

  async revertSchemeAccount(id, data) {
    try {
      const updatedData = await schemeAccountModel.updateOne(
        { _id: id },
        { $set: data },
        { new: true }
      );

      if (updatedData.modifiedCount === 0) {
        return null;
      }

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async closeSchemeAccount(id, data) {
    try {
      // Ensure id is treated as an array for $in
      const ids = Array.isArray(id) ? id : [id];

      const newSchemeAcc = await schemeAccountModel.updateMany(
        { _id: { $in: ids } },
        {
          $set: data,
        }
      );

      if (newSchemeAcc.matchedCount === 0) {
        return null;
      }

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async aggregate(pipeline) {
    try {
      const newSchemeAcc = await schemeAccountModel.aggregate(pipeline);

      if (newSchemeAcc.length > 0) {
        return newSchemeAcc
      }

      return false;
    } catch (error) {
      console.error(error);
    }
  }

  async getAccounts(pipeline) {
    try {
      const newSchemeAcc = await schemeAccountModel.aggregate(pipeline);

      if (newSchemeAcc.length > 0) {
        return newSchemeAcc
      }

      return false;
    } catch (error) {
      console.error(error);
    }
  }

  async searchMobieSchemeAccount(query) {
    try {
      const newSchemeAcc = await schemeAccountModel
        .find(query)
        .populate({
          path: "id_scheme",
          populate: {
            path: "id_metal",
          },
        })
        .populate("id_classification")
        .populate("id_customer")
        .populate("id_branch", "branch_name")
        .exec();

      if (!newSchemeAcc) {
        return null;
      }

      return newSchemeAcc;
    } catch (error) {
      console.error(error);
    }
  }

  async findInfo(id) {
    try {
      const data = await schemeAccountModel
        .findById(id)
        .populate([
          {
            path: "id_customer",
            select: "mobile",
          },
          {
            path: "id_scheme",
            select: "scheme_name",
          },
        ])
        .lean();

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getPaymentByAccNumber(accNum) {
    try {
      const data = await schemeAccountModel.aggregate([
        {
          $match: {
            scheme_acc_number: accNum,
            active: true,
            is_deleted: false,
          },
        },
        {
          $lookup: {
            from: "payments",
            let: { schemeAccountId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$id_scheme_account", "$$schemeAccountId"] },
                      { $eq: ["$active", true] },
                      { $eq: ["$payment_status", 1] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "schemes",
                  localField: "id_scheme",
                  foreignField: "_id",
                  as: "scheme_details",
                },
              },
              { $unwind: "$scheme_details" },
              {
                $lookup: {
                  from: "schemeaccounts",
                  localField: "id_scheme_account",
                  foreignField: "_id",
                  as: "scheme_account_details",
                },
              },
              { $unwind: "$scheme_account_details" },
              {
                $lookup: {
                  from: "branches",
                  localField: "id_branch",
                  foreignField: "_id",
                  as: "branch_details",
                },
              },
              { $unwind: "$branch_details" },
              {
                $lookup: {
                  from: "customers",
                  localField: "id_customer",
                  foreignField: "_id",
                  as: "customer_details",
                },
              },
              { $unwind: "$customer_details" },
              {
                $lookup: {
                  from: "cities",
                  localField: "branch_details.id_city",
                  foreignField: "_id",
                  as: "city_details",
                },
              },
              { $unwind: "$city_details" },
              {
                $group: {
                  _id: null,
                  related_payments: { $push: "$$ROOT" },
                  total_paid_installments: { $sum: "$paid_installments" },
                  total_paid_amount: { $sum: "$payment_amount" },
                  total_paid_weight: { $sum: "$metal_weight" },
                },
              },
            ],
            as: "related_payments",
          },
        },
        {
          $project: {
            scheme_acc_number: 1,
            account_name: 1,
            id_branch: 1,
            total_installments: 1,
            paymentcount: 1,
            active: 1,
            related_payments: 1,
            city_details: 1,
            customer_details: 1,
            scheme_details: 1,
            scheme_account_details: 1,
          },
        },
      ]);

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getSchemeCountByCustomer(id_customer) {
    try {
      const result = await schemeAccountModel.aggregate([
        {
          $match: { id_customer: id_customer }, // Filter by customer ID
        },
        {
          $group: {
            _id: null,
            activeScheme: { $sum: { $cond: [{ $eq: ["$status", 0] }, 1, 0] } }, // Open schemes
            closeScheme: { $sum: { $cond: [{ $eq: ["$status", 1] }, 1, 0] } }, // Closed schemes
            completedScheme: {
              $sum: { $cond: [{ $eq: ["$status", 2] }, 1, 0] },
            }, // Completed schemes
          },
        },
        {
          $project: {
            _id: 0, // Exclude _id field
            activeScheme: 1,
            closeScheme: 1,
            completedScheme: 1,
          },
        },
      ]);

      return result.length > 0
        ? result[0]
        : { activeScheme: 0, closeScheme: 0, completedScheme: 0 };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findCustomerAccountCounts(customerId, schemeId) {
    try {
      const schemeData = await schemeAccountModel.countDocuments({
        id_customer: customerId,
        id_scheme: schemeId,
      });

      if (schemeData) {
        return schemeData;
      }

      return 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateSchemNumber(id, data) {
    try {
      const updatedData = await schemeAccountModel.updateOne(
        { _id: id },
        { $set: data }
      );

      if (updatedData.modifiedCount === 0) {
        return null;
      }

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSchemeAccountsForMobile(customerId, weight) {
    try {
      const matchStages = [
        {
          $match: {
            id_customer: new mongoose.Types.ObjectId(customerId),
            active: true,
            is_deleted: false
          },
        }
      ];

      const pipeline = [
        ...matchStages,
        {
          $lookup: {
            from: "schemestatuses",
            localField: "status",
            foreignField: "id_status",
            as: "schemestatusnames",
          },
        },
        {
          $unwind: {
            path: "$schemestatusnames",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "schemes",
            localField: "id_scheme",
            foreignField: "_id",
            as: "schemes",
          },
        },
        {
          $unwind: {
            path: "$schemes",
            preserveNullAndEmptyArrays: false,
          },
        },
        ...(weight
          ? [
            {
              $match: {
                "schemes.scheme_type": { $in: [12, 3, 4, 6, 2, 5] },
              },
            },
          ]
          : []),

        {
          $addFields: {
            currentDate: new Date(),
            startDateObj: "$start_date",
            schemeInstallmentType: "$scheme.installment_type"
          }
        },
        {
          $addFields: {
            expectedDueDates: {
              $let: {
                vars: {
                  startDate: "$startDateObj",
                  totalInstallments: "$total_installments",
                  installmentType: "$schemeInstallmentType"
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
                              { case: { $eq: ["$$installmentType", 1] }, then: "month" },
                              { case: { $eq: ["$$installmentType", 2] }, then: "week" },
                              { case: { $eq: ["$$installmentType", 3] }, then: "day" },
                              { case: { $eq: ["$$installmentType", 4] }, then: "year" }
                            ],
                            default: "month"
                          }
                        },
                        amount: "$$i"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          $addFields: {
            expectedInstallmentCount: {
              $size: {
                $filter: {
                  input: "$expectedDueDates",
                  as: "dueDate",
                  cond: { $lte: ["$$dueDate", "$currentDate"] }
                }
              }
            }
          }
        },
        {
          $addFields: {
            overdueInstallments: {
              $cond: {
                if: { $gt: ["$expectedInstallmentCount", "$paid_installments"] },
                then: { $subtract: ["$expectedInstallmentCount", "$paid_installments"] },
                else: 0
              }
            }
          }
        },
        {
          $addFields: {
            nextDueDate: {
              $let: {
                vars: {
                  futureDates: {
                    $filter: {
                      input: "$expectedDueDates",
                      as: "date",
                      cond: { $gt: ["$$date", "$currentDate"] }
                    }
                  }
                },
                in: {
                  $cond: {
                    if: { $gt: [{ $size: "$$futureDates" }, 0] },
                    then: { $min: "$$futureDates" }, // the earliest future date
                    else: null // if no future date left (fully paid)
                  }
                }
              }
            }
          }
        },

        {
          $lookup: {
            from: "payments",
            let: { schemeAccountId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$id_scheme_account", "$$schemeAccountId"] },
                      { $eq: ["$active", true] },
                      { $eq: ["$payment_status", 1] },
                    ],
                  },
                },
              },
              { $sort: { createdAt: -1 } },
              {
                $addFields: {
                  total_digi_bonus: { $divide: ["$digiBonus", "$metal_rate"] }
                }
              },
              {
                $group: {
                  _id: null,
                  related_payments: { $push: "$$ROOT" },
                  total_paid_installments: { $sum: "$paid_installments" },
                  total_paid_amount: { $sum: "$payment_amount" },
                  total_paid_weight: { $sum: "$metal_weight" },
                  last_payment: { $first: "$$ROOT" },
                  total_digi_bonus: { $sum: "$total_digi_bonus" },
                  weighted_metal_rate_sum: {
                    $sum: { $multiply: ["$metal_rate", "$paid_installments"] }
                  },
                },
              },
              {
                $project: {
                  related_payments: 1,
                  paid_installments: 1,
                  total_paid_amount: 1,
                  total_paid_weight: 1,
                  digi_bonus: "$total_digi_bonus",
                  last_total_amt: "$last_payment.total_amt",
                  avg_metal_rate: {
                    $cond: {
                      if: { $gt: ["$total_paid_installments", 0] },
                      then: { $divide: ["$weighted_metal_rate_sum", "$total_paid_installments"] },
                      else: 0
                    }
                  },
                  last_total_amt: "$last_payment.total_amt",

                },
              },
            ],
            as: "payment_info",
          },
        },
        {
          $unwind: {
            path: "$payment_info",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $addFields: {
            total_digi_bonus: { $sum: "$payment_info.digi_bonus" }
          }
        },
        {
          $addFields: {
            related_payments: { $ifNull: ["$payment_info.related_payments", []] },
            total_paid_installments: { $ifNull: ["$payment_info.paid_installments", 0] },
            total_paid_amount: { $ifNull: ["$payment_info.total_paid_amount", 0] },
            total_paid_weight: { $ifNull: ["$payment_info.total_paid_weight", 0] },
            last_total_amt: { $ifNull: ["$payment_info.last_total_amt", 0] },
            schemestatusName: "$schemestatusnames.status_name",
            schemeName: "$schemes.scheme_name",
            schemeType: "$schemes.scheme_type"
          }
        },

        {
          $facet: {
            schemeAccounts: [
              {
                $project: {
                  scheme_acc_number: 1,
                  account_name: 1,
                  id_branch: 1,
                  total_installments: 1,
                  paymentcount: 1,
                  active: 1,
                  last_total_amt: 1,
                  total_paid_amount: 1,
                  total_paid_weight: 1,
                  total_paid_installments: "$paid_installments",
                  schemestatusName: 1,
                  status: "$status",
                  schemeName: 1,
                  maturity_date: 1,
                  schemeType: 1,
                  minAmount: "$schemes.min_amount",
                  maxAmount: "$schemes.max_amount",
                  minWeight: "$schemes.min_weight",
                  maxWeight: "$schemes.max_weight",
                  monthlyPayable: "$flexFixed",
                  startDate: "$start_date",
                  flexFixed: "$flexFixed",
                  overdueInstallments: "$overdueInstallments",
                  nextDueDate: 1,
                  schemeBenefit: "$total_digi_bonus",
                  avgMetalRate: "$payment_info.avg_metal_rate",
                },
              },
            ],
            summary: [
              {
                $group: {
                  _id: null,
                  total_paid_installments: { $sum: "$paid_installments" },
                  total_paid_amount: { $sum: "$total_paid_amount" },
                  total_paid_weight: { $sum: "$total_paid_weight" },
                },
              },
              {
                $project: {
                  _id: 0,
                  total_paid_installments: 1,
                  total_paid_amount: 1,
                  total_paid_weight: 1,
                },
              },
            ],
          },
        },
      ];

      const result = await schemeAccountModel.aggregate(pipeline);
      return result[0];
    } catch (error) {
      console.error("Error in getAllSchemeAccountsForMobile:", error);
      throw error;
    }
  }

  async getMetalBasedSavings(customerId) {
    try {
      const result = await schemeAccountModel.aggregate([
        {
          $match: {
            id_customer: new mongoose.Types.ObjectId(customerId),
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
          $match: {
            "scheme.scheme_type": { $in: [12, 3, 4, 6, 2, 5] },
          },
        },
        {
          $lookup: {
            from: "payments",
            let: { schemeAccountId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$id_scheme_account", "$$schemeAccountId"] },
                      { $eq: ["$active", true] },
                      { $eq: ["$payment_status", 1] },
                    ],
                  },
                },
              },
            ],
            as: "payments",
          },
        },
        {
          $unwind: {
            path: "$payments",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $sort: {
            "payments.createdAt": -1,
          },
        },
        {
          $group: {
            _id: {
              id_metal: "$scheme.id_metal",
              schemeAccountId: "$_id",
            },
            total_saved_weight: { $sum: "$payments.metal_weight" },
            last_saved_weight: { $first: "$payments.metal_weight" },
            paid_installments: { $first: "$paid_installments" },
            total_installments: { $first: "$total_installments" },
          },
        },
        {
          $group: {
            _id: "$_id.id_metal",
            total_saved_weight: { $sum: "$total_saved_weight" },
            last_saved_weight: { $first: "$last_saved_weight" },
            total_paid_installments: { $sum: "$paid_installments" },
            total_installments: { $sum: "$total_installments" },
          },
        },
        {
          $lookup: {
            from: "metals",
            localField: "_id",
            foreignField: "_id",
            as: "metal",
          },
        },
        { $unwind: "$metal" },
        {
          $project: {
            id_metal: "$_id",
            metalName: "$metal.metal_name",
            total_saved_weight: 1,
            last_saved_weight: 1,
            total_paid_installments: 1,
            total_installments: 1,
            _id: 0,
          },
        },
      ]);

      return result;
    } catch (error) {
      console.error("Error in getMetalBasedSavings:", error);
      throw error;
    }
  }

  //!use porperly
  async updateUniversal(query, update) {
    try {
      const updatedData = await schemeAccountModel.updateOne(query, update);

      if (updatedData.matchedCount === 0) {
        return null;
      }

      return updatedData;
    } catch (error) {
      console.error(error);
    }
  }

  async updateAmountOrWeight(id, amountIncrement, weightIncrement, paidDate) {
    try {
      await schemeAccountModel.updateOne(
        {
          _id: id,
          $or: [{ weight: null }, { weight: { $exists: false } }]
        },
        { $set: { weight: 0 } }
      );

      const updatedData = await schemeAccountModel.updateOne(
        { _id: id },
        {
          $inc: {
            amount: amountIncrement,
            weight: weightIncrement
          },
          $set: paidDate
        }
      );

      if (updatedData.matchedCount === 0) {
        return null;
      }

      return updatedData;
    } catch (error) {
      console.error("Error in updateAmountOrWeight:", error);
      throw error;
    }
  }

  async overdueCalculation(customerId) {
    try {
      const result = await schemeAccountModel.aggregate([
        {
          $match: {
            "id_customer": new mongoose.Types.ObjectId(customerId),
            "status": 0,
            "active": true,
            "is_deleted": false
          }
        },
        {
          $lookup: {
            from: "schemes",
            localField: "id_scheme",
            foreignField: "_id",
            as: "scheme"
          }
        },
        { $unwind: "$scheme" },
        {
          $addFields: {
            currentDate: new Date(),
            startDateObj: "$start_date",
            lastPaidDateObj: "$last_paid_date",
            schemeInstallmentType: "$scheme.installment_type",
            schemeId: "$scheme._id",
            schemeName: "$scheme.scheme_name"
          }
        },
        {
          $addFields: {
            expectedDueDates: {
              $let: {
                vars: {
                  startDate: "$startDateObj",
                  totalInstallments: "$total_installments",
                  installmentType: "$schemeInstallmentType"
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
                              { case: { $eq: ["$$installmentType", 1] }, then: "month" },
                              { case: { $eq: ["$$installmentType", 2] }, then: "week" },
                              { case: { $eq: ["$$installmentType", 3] }, then: "day" },
                              { case: { $eq: ["$$installmentType", 4] }, then: "year" }
                            ],
                            default: "month"
                          }
                        },
                        amount: "$$i"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          $addFields: {
            expectedInstallmentCount: {
              $size: {
                $filter: {
                  input: "$expectedDueDates",
                  as: "dueDate",
                  cond: { $lte: ["$$dueDate", "$currentDate"] }
                }
              }
            },
            lastExpectedDueDate: {
              $let: {
                vars: {
                  pastDueDates: {
                    $filter: {
                      input: "$expectedDueDates",
                      as: "dueDate",
                      cond: { $lte: ["$$dueDate", "$currentDate"] }
                    }
                  }
                },
                in: { $arrayElemAt: ["$$pastDueDates", -1] }
              }
            },
            nextDueDate: {
              $let: {
                vars: {
                  lastDueIndex: {
                    $indexOfArray: [
                      "$expectedDueDates",
                      {
                        $let: {
                          vars: {
                            pastDueDates: {
                              $filter: {
                                input: "$expectedDueDates",
                                as: "dueDate",
                                cond: { $lte: ["$$dueDate", "$currentDate"] }
                              }
                            }
                          },
                          in: { $arrayElemAt: ["$$pastDueDates", -1] }
                        }
                      }
                    ]
                  }
                },
                in: {
                  $cond: {
                    if: { $lt: ["$$lastDueIndex", { $subtract: [{ $size: "$expectedDueDates" }, 1] }] },
                    then: { $arrayElemAt: ["$expectedDueDates", { $add: ["$$lastDueIndex", 1] }] },
                    else: null
                  }
                }
              }
            }
          }
        },
        {
          $addFields: {
            overdueInstallments: {
              $cond: {
                if: { $gt: ["$expectedInstallmentCount", "$paid_installments"] },
                then: { $subtract: ["$expectedInstallmentCount", "$paid_installments"] },
                else: 0
              }
            },
            isOverdue: {
              $gt: ["$expectedInstallmentCount", "$paid_installments"]
            },
            daysOverdue: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$paid_installments", "$total_installments"] },
                    { $lt: ["$nextDueDate", "$currentDate"] }
                  ]
                },
                then: {
                  $dateDiff: {
                    startDate: "$nextDueDate",
                    endDate: "$currentDate",
                    unit: "day"
                  }
                },
                else: 0
              }
            }
          }
        },
        {
          $facet: {
            schemeOverdues: [
              {
                $group: {
                  _id: "$schemeId",
                  schemeName: { $first: "$schemeName" },
                  totalAccounts: { $sum: 1 },
                  overdueAccounts: {
                    $sum: { $cond: [{ $gt: ["$overdueInstallments", 0] }, 1, 0] }
                  },
                  hasOverdue: { $max: "$isOverdue" },
                  totalFlexFixedOverdue: {
                    $sum: {
                      $cond: [
                        { $gt: ["$overdueInstallments", 0] },
                        "$flexFixed",
                        0
                      ]
                    }
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  schemeId: "$_id",
                  schemeName: 1,
                  totalAccounts: 1,
                  overdueAccounts: 1,
                  totalFlexFixedOverdue: 1
                }
              }
            ],
            accountDetails: [
              {
                $project: {
                  _id: 0,
                  scheme_acc_number: 1,
                  account_name: 1,
                  start_date: 1,
                  last_paid_date: 1,
                  paid_installments: 1,
                  total_installments: 1,
                  schemeInstallmentType: 1,
                  expectedInstallmentCount: 1,
                  overdueInstallments: 1,
                  isOverdue: 1,
                  daysOverdue: 1,
                  nextDueDate: 1,
                  lastExpectedDueDate: 1,
                  schemeId: 1,
                  schemeName: 1,
                  flexFixed: 1
                }
              }
            ]
          }
        },
        {
          $project: {
            schemes: "$schemeOverdues",
            accounts: "$accountDetails",
            totalOverdueSchemes: {
              $size: {
                $filter: {
                  input: "$schemeOverdues",
                  as: "scheme",
                  cond: { $gt: ["$$scheme.overdueAccounts", 0] }
                }
              }
            },
            totalOverdueAccounts: {
              $sum: {
                $map: {
                  input: "$accountDetails",
                  as: "account",
                  in: "$$account.overdueInstallments"
                }
              }
            },
            totalFlexFixedOverdue: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$accountDetails",
                      as: "account",
                      cond: { $gt: ["$$account.overdueInstallments", 0] }
                    }
                  },
                  as: "overdueAccount",
                  in: "$$overdueAccount.flexFixed"
                }
              }
            }
          }
        },
        { $unwind: "$schemes" },
        { $unwind: "$accounts" },
        {
          $group: {
            _id: null,
            schemes: { $push: "$schemes" },
            accounts: { $push: "$accounts" },
            totalOverdueSchemes: { $first: "$totalOverdueSchemes" },
            totalOverdueAccounts: { $first: "$totalOverdueAccounts" },
            totalFlexFixedOverdue: { $first: "$totalFlexFixedOverdue" }
          }
        },
        {
          $project: {
            _id: 0,
            schemes: 1,
            accounts: 1,
            totalOverdueAccounts: 1,
            totalOverdueSchemes: 1,
            totalFlexFixedOverdue: 1
          }
        }
      ]);
      if (result.length === 0) {
        return {
          accounts: [],
          schemes: [],
          totalOverdueAccounts: 0,
          totalOverdueSchemes: 0,
          totalFlexFixedOverdue: 0
        };
      }

      return result[0];
    } catch (error) {
      console.error("Error in overdueCalculation:", error);
      throw error;
    }
  }

  async bulkWrite(bulkOps) {
    try {
      const updatedData = await schemeAccountModel.bulkWrite(bulkOps);

      if (updatedData.matchedCount === 0) {
        return null;
      }

      return updatedData;
    } catch (error) {
      console.error(error);
    }
  }

  async overdueCalculationForNotification(customerId) {
    try {
      const result = await schemeAccountModel.aggregate([
        {
          $match: {
            "id_customer": new mongoose.Types.ObjectId(customerId),
            "status": 0,
            "active": true,
            "is_deleted": false
          }
        },
        {
          $lookup: {
            from: "schemes",
            localField: "id_scheme",
            foreignField: "_id",
            as: "scheme"
          }
        },
        { $unwind: "$scheme" },
        {
          $match: {
            "scheme.scheme_type": { $nin: [10, 14] }
          }
        },
        {
          $addFields: {
            currentDate: new Date(),
            startDateObj: "$start_date",
            lastPaidDateObj: "$last_paid_date",
            schemeInstallmentType: "$scheme.installment_type",
            schemeId: "$scheme._id",
            schemeName: "$scheme.scheme_name"
          }
        },
        {
          $addFields: {
            expectedDueDates: {
              $let: {
                vars: {
                  startDate: "$startDateObj",
                  totalInstallments: "$total_installments",
                  installmentType: "$schemeInstallmentType"
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
                              { case: { $eq: ["$$installmentType", 1] }, then: "month" },
                              { case: { $eq: ["$$installmentType", 2] }, then: "week" },
                              { case: { $eq: ["$$installmentType", 3] }, then: "day" },
                              { case: { $eq: ["$$installmentType", 4] }, then: "year" }
                            ],
                            default: "month"
                          }
                        },
                        amount: "$$i"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          $addFields: {
            expectedInstallmentCount: {
              $size: {
                $filter: {
                  input: "$expectedDueDates",
                  as: "dueDate",
                  cond: { $lte: ["$$dueDate", "$currentDate"] }
                }
              }
            },
            lastExpectedDueDate: {
              $let: {
                vars: {
                  pastDueDates: {
                    $filter: {
                      input: "$expectedDueDates",
                      as: "dueDate",
                      cond: { $lte: ["$$dueDate", "$currentDate"] }
                    }
                  }
                },
                in: { $arrayElemAt: ["$$pastDueDates", -1] }
              }
            },
            nextDueDate: {
              $let: {
                vars: {
                  lastDueIndex: {
                    $indexOfArray: [
                      "$expectedDueDates",
                      {
                        $let: {
                          vars: {
                            pastDueDates: {
                              $filter: {
                                input: "$expectedDueDates",
                                as: "dueDate",
                                cond: { $lte: ["$$dueDate", "$currentDate"] }
                              }
                            }
                          },
                          in: { $arrayElemAt: ["$$pastDueDates", -1] }
                        }
                      }
                    ]
                  }
                },
                in: {
                  $cond: {
                    if: { $lt: ["$$lastDueIndex", { $subtract: [{ $size: "$expectedDueDates" }, 1] }] },
                    then: { $arrayElemAt: ["$expectedDueDates", { $add: ["$$lastDueIndex", 1] }] },
                    else: null
                  }
                }
              }
            }
          }
        },
        {
          $addFields: {
            overdueInstallments: {
              $cond: {
                if: { $gt: ["$expectedInstallmentCount", "$paid_installments"] },
                then: { $subtract: ["$expectedInstallmentCount", "$paid_installments"] },
                else: 0
              }
            },
            isOverdue: {
              $gt: ["$expectedInstallmentCount", "$paid_installments"]
            },
            daysOverdue: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$paid_installments", "$total_installments"] },
                    { $lt: ["$nextDueDate", "$currentDate"] }
                  ]
                },
                then: {
                  $dateDiff: {
                    startDate: "$nextDueDate",
                    endDate: "$currentDate",
                    unit: "day"
                  }
                },
                else: 0
              }
            }
          }
        },
        {
          $facet: {
            schemeOverdues: [
              {
                $group: {
                  _id: "$schemeId",
                  schemeName: { $first: "$schemeName" },
                  totalAccounts: { $sum: 1 },
                  overdueAccounts: {
                    $sum: { $cond: [{ $gt: ["$overdueInstallments", 0] }, 1, 0] }
                  },
                  hasOverdue: { $max: "$isOverdue" },
                  totalFlexFixedOverdue: {
                    $sum: {
                      $cond: [
                        { $gt: ["$overdueInstallments", 0] },
                        "$flexFixed",
                        0
                      ]
                    }
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  schemeId: "$_id",
                  schemeName: 1,
                  totalAccounts: 1,
                  overdueAccounts: 1,
                  totalFlexFixedOverdue: 1
                }
              }
            ],
            accountDetails: [
              {
                $project: {
                  _id: 0,
                  scheme_acc_number: 1,
                  account_name: 1,
                  start_date: 1,
                  last_paid_date: 1,
                  paid_installments: 1,
                  total_installments: 1,
                  schemeInstallmentType: 1,
                  expectedInstallmentCount: 1,
                  overdueInstallments: 1,
                  isOverdue: 1,
                  daysOverdue: 1,
                  nextDueDate: 1,
                  lastExpectedDueDate: 1,
                  schemeId: 1,
                  schemeName: 1,
                  flexFixed: 1
                }
              }
            ]
          }
        },
        {
          $project: {
            schemes: "$schemeOverdues",
            accounts: "$accountDetails",
            totalOverdueSchemes: {
              $size: {
                $filter: {
                  input: "$schemeOverdues",
                  as: "scheme",
                  cond: { $gt: ["$$scheme.overdueAccounts", 0] }
                }
              }
            },
            totalOverdueAccounts: {
              $sum: {
                $map: {
                  input: "$accountDetails",
                  as: "account",
                  in: "$$account.overdueInstallments"
                }
              }
            },
            totalFlexFixedOverdue: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$accountDetails",
                      as: "account",
                      cond: { $gt: ["$$account.overdueInstallments", 0] }
                    }
                  },
                  as: "overdueAccount",
                  in: "$$overdueAccount.flexFixed"
                }
              }
            },
            overdueAccountNumbers: {
              $map: {
                input: {
                  $filter: {
                    input: "$accountDetails",
                    as: "acc",
                    cond: { $gt: ["$$acc.overdueInstallments", 0] }
                  }
                },
                as: "acc",
                in: "$$acc.scheme_acc_number"
              }
            }
          }
        },
        { $unwind: "$schemes" },
        { $unwind: "$accounts" },
        {
          $group: {
            _id: null,
            schemes: { $push: "$schemes" },
            accounts: { $push: "$accounts" },
            totalOverdueSchemes: { $first: "$totalOverdueSchemes" },
            totalOverdueAccounts: { $first: "$totalOverdueAccounts" },
            totalFlexFixedOverdue: { $first: "$totalFlexFixedOverdue" },
            overdueAccountNumbers: { $first: "$overdueAccountNumbers" }
          }
        },
        {
          $project: {
            _id: 0,
            schemes: 1,
            accounts: 1,
            totalOverdueAccounts: 1,
            totalOverdueSchemes: 1,
            totalFlexFixedOverdue: 1,
            overdueAccountNumbers: 1
          }
        }
      ]);

      if (result.length === 0) {
        return {
          accounts: [],
          schemes: [],
          overdueAccountNumbers: [],
          totalOverdueAccounts: 0,
          totalOverdueSchemes: 0,
          totalFlexFixedOverdue: 0
        };
      }

      return result[0];
    } catch (error) {
      console.error("Error in overdueCalculation:", error);
      throw error;
    }
  }

  async hardDelete(id) {
    try {
      const deletedData = await schemeAccountModel.deleteOne({ _id: id });

      if (deletedData.deletedCount === 0) {
        return null;
      }

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async customMobileSearchAggregation(query) {
    try {
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: "customers",
            localField: "id_customer",
            foreignField: "_id",
            as: "customer_details",
          },
        },
        { $unwind: { path: "$customer_details", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "schemes",
            localField: "id_scheme",
            foreignField: "_id",
            as: "scheme_details",
          },
        },
        { $unwind: { path: "$scheme_details", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "branches",
            localField: "id_branch",
            foreignField: "_id",
            as: "branch_details",
          },
        },
        { $unwind: { path: "$branch_details", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "schemetypes",
            localField: "scheme_details.scheme_type",
            foreignField: "scheme_type",
            as: "schemetype_details",
          },
        },
        { $unwind: { path: "$schemetype_details", preserveNullAndEmptyArrays: true } },
        // {
        //   $lookup: {
        //     from: "metals",
        //     localField: "scheme_details.id_metal",
        //     foreignField: "_id",
        //     as: "metal_details",
        //   },
        // },
        // { $unwind: { path: "$metal_details", preserveNullAndEmptyArrays: true } },
        // {
        //   $lookup: {
        //     from: "purities",
        //     localField: "scheme_details.id_purity",
        //     foreignField: "_id",
        //     as: "purity_details",
        //   },
        // },
        // { $unwind: { path: "$purity_details", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "payments",
            let: { accountId: { $toObjectId: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$id_scheme_account", "$$accountId"] },
                      { $eq: ["$active", true] },
                      { $eq: ["$payment_status", 1] },
                    ],
                  },
                },
              },
              { $sort: { createdAt: -1 } },
            ],
            as: "all_payments",
          },
        },
        {
          $addFields: {
            calcpayment: {
              $reduce: {
                input: "$all_payments",
                initialValue: { amount: 0, total_weight: 0, fine_amount: 0, total_installments: 0 },
                in: {
                  amount: { $add: ["$$value.amount", { $ifNull: ["$$this.payment_amount", 0] }] },
                  total_weight: { $add: ["$$value.total_weight", { $toDouble: { $ifNull: ["$$this.metal_weight", 0] } }] },
                  fine_amount: { $add: ["$$value.fine_amount", { $ifNull: ["$$this.fine_amount", 0] }] },
                  total_installments: { $add: ["$$value.total_installments", { $ifNull: ["$$this.paid_installments", 0] }] },
                },
              },
            },
            lastpayment: { $arrayElemAt: ["$all_payments", 0] },
          },
        },
        {
          $addFields: {
            id_scheme_account: "$_id",
            mobile: "$customer_details.mobile",
            branch_name: "$branch_details.branch_name",
            scheme_typename: "$schemetype_details.scheme_typename",
            metal_name: "$metal_details.metal_name",
            purity_name: "$purity_details.purity_name",
            total_paidamount: { $ifNull: ["$calcpayment.amount", "$amount"] },
            total_weight: "$calcpayment.total_weight",
            fine_amount: "$calcpayment.fine_amount",
            total_paidinstallments: "$paid_installments",
            last_paid_installment: { $ifNull: ["$lastpayment.paid_installments", 0] },
            last_paid_amount: { $ifNull: ["$lastpayment.payment_amount", 0] },
            last_paid_weight: { $ifNull: ["$lastpayment.metal_weight", 0] },
            // created_through: {
            //   $switch: {
            //     branches: [
            //       { case: { $eq: ["$added_by", 3] }, then: "Admin" },
            //       { case: { $eq: ["$added_by", 1] }, then: "Android" },
            //       { case: { $eq: ["$added_by", 2] }, then: "IOS" }
            //     ],
            //     default: "Web"
            //   }
            // },
            id_customer: {
              _id: "$customer_details._id",
              address: "$customer_details.address",
            },
            id_scheme: {
              _id: "$scheme_details._id",
              scheme_name: "$scheme_details.scheme_name",
              scheme_type: "$scheme_details.scheme_type",
              amount: "$scheme_details.amount",
              total_installments: "$scheme_details.total_installments",
              min_amount: "$scheme_details.min_amount",
              max_amount: "$scheme_details.max_amount",
              min_weight: "$scheme_details.min_weight",
              max_weight: "$scheme_details.max_weight",
              id_metal: "$scheme_details.id_metal",
              id_purity: "$scheme_details.id_purity",
              no_of_gifts: "$scheme_details.no_of_gifts",
              bonus_amount: "$scheme_details.bonus_amount",
              bonus_percent: "$scheme_details.bonus_percent",
              bonus_type: "$scheme_details.bonus_type",
            },
            scheme_type: "$scheme_details.scheme_type",
            scheme_name: {
              $switch: {
                branches: [
                  {
                    case: { $in: ["$scheme_details.scheme_type", [0, 1, 2, 5, 6, 7, 8, 9, 10, 11]] },
                    then: { $concat: ["$scheme_details.scheme_name", " (Rs. ", { $toString: { $ifNull: ["$scheme_details.min_amount", "0"] } }, " - ", { $toString: { $ifNull: ["$scheme_details.max_amount", "0"] } }, ")"] }
                  },
                  {
                    case: { $in: ["$scheme_details.scheme_type", [12, 3, 4]] },
                    then: { $concat: ["$scheme_details.scheme_name", " (Gm ", { $toString: { $ifNull: ["$scheme_details.min_weight", "0"] } }, " - ", { $toString: { $ifNull: ["$scheme_details.max_weight", "0"] } }, ")"] }
                  }
                ],
                default: { $concat: ["$scheme_details.scheme_name", " (Rs. ", { $toString: { $ifNull: ["$scheme_details.amount", "0"] } }, ")"] }
              }
            },
            status_name: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 0] }, then: "Open" },
                  { case: { $eq: ["$status", 1] }, then: "Closed" },
                  { case: { $eq: ["$status", 2] }, then: "Completed" },
                  { case: { $eq: ["$status", 3] }, then: "Preclose" },
                  { case: { $eq: ["$status", 4] }, then: "Refund" }
                ],
                default: "Unknown"
              }
            }
          },
        },
        {
          $project: {
            all_payments: 0,
            calcpayment: 0,
            lastpayment: 0,
            customer_details: 0,
            scheme_details: 0,
            branch_details: 0,
            schemetype_details: 0,
            metal_details: 0,
            purity_details: 0,
            added_by: 0,
            closed_date: 0,
            referral_id: 0,
            referral_type: 0,
            referralpaid: 0,
            referral_code: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            date_added: 0,
            date_updated: 0,
            active: 0,
            is_deleted: 0,
          },
        },
        { $sort: { last_paid_date: -1 } },
      ];

      return await schemeAccountModel.aggregate(pipeline);
    } catch (error) {
      console.error("Aggregation Error:", error);
      throw error;
    }
  }

  async searchSchemeAccountData(schemeAccNumber) {
    try {
      const data = await schemeAccountModel.aggregate([
        {
          $match: {
            scheme_acc_number: schemeAccNumber
          }
        },

        {
          $lookup: {
            from: "customers",
            localField: "id_customer",
            foreignField: "_id",
            as: "id_customer"
          }
        },
        { $unwind: "$id_customer" },

        {
          $lookup: {
            from: "schemes",
            localField: "id_scheme",
            foreignField: "_id",
            as: "id_scheme"
          }
        },
        { $unwind: "$id_scheme" },

        {
          $lookup: {
            from: "purchasewallethistories",
            let: { schemeAccountId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$idSchemeAccount", "$$schemeAccountId"]
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  created_at: 1,
                  weightSaved: 1
                }
              },
              {
                $sort: { created_at: -1 }
              }
            ],
            as: "purchaseHistory"
          }
        }
      ]);

      return data[0] || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default SchemeAccountRepository;