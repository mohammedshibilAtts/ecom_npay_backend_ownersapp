import closeAccBillModel from "../../models/chit/closeAccBillModel.js";
import paymentModel from "../../models/chit/paymentModel.js";
import schemeAccountModel from "../../models/chit/schemeAccountModel.js";

class ChitRedeemRepository {
  async findSchemeAccount({ mobile, scheme_acc_number }) {
    if (!mobile && !scheme_acc_number) {
      throw new Error("Mobile or Scheme Account no is required", 400);
    }

    const pipeline = [
      {
        $match: {
          is_deleted: false,
          ...(scheme_acc_number ? { scheme_acc_number } : {}),
        },
      },

      {
        $lookup: {
          from: "customers",
          localField: "id_customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },

      ...(mobile
        ? [
          {
            $match: {
              "customer.mobile": String(mobile),
            },
          },
        ]
        : []),

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
        $lookup: {
          from: "metals",
          localField: "scheme.id_metal",
          foreignField: "_id",
          as: "metal",
        },
      },
      { $unwind: "$metal" },

      {
        $lookup: {
          from: "schemetypes",
          localField: "scheme.scheme_type",
          foreignField: "scheme_type",
          as: "scheme_type",
        },
      },
      { $unwind: "$scheme_type" },

      {
        $lookup: {
          from: "schemestatuses",
          localField: "status",
          foreignField: "id_status",
          as: "schemestatuses",
        },
      },
      { $unwind: "$schemestatuses" },

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
                    { $eq: ["$is_deleted", false] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                total_paid_amount: { $sum: "$payment_amount" },
                total_metal_weight: { $sum: "$metal_weight" },
                total_paid_installments: { $sum: "$installment" },
              },
            },
          ],
          as: "payment_info",
        },
      },
      {
        $unwind: {
          path: "$payment_info",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "wallets",
          let: { customerId: "$customer._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$id_customer", "$$customerId"] },
                    { $eq: ["$payment_status", 1] },
                    { $eq: ["$is_deleted", false] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                total_wallet_balance: { $sum: "$balance_amt" },
              },
            },
          ],
          as: "wallet_info",
        },
      },
      {
        $unwind: {
          path: "$wallet_info",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "closeaccbills",
          let: { schemeAccountId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$id_scheme_account", "$$schemeAccountId"] },
                    { $eq: ["$active", 1] },
                  ],
                },
              },
            },
            {
              $project: {
                return_amount: 1,
                chitRedeemed: 1,
              },
            },
          ],
          as: "close_bill_info",
        },
      },
      {
        $unwind: {
          path: "$close_bill_info",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: "$customer._id",

          customer_info: {
            $first: {
              _id: "$customer._id",
              firstname: "$customer.firstname",
              lastname: "$customer.lastname",
              mobile: "$customer.mobile",
              wallet_amount: {
                $ifNull: ["$wallet_info.total_wallet_balance", 0],
              },
            },
          },

          scheme_info: {
            $push: {
              id_scheme_account: "$_id",
              scheme_acc_number: "$scheme_acc_number",
              scheme_name: "$scheme.scheme_name",
              scheme_status_name: "$schemestatuses.status_name",
              maturity_date: "$maturity_date",
              total_metal_weight: {
                $ifNull: ["$payment_info.total_metal_weight", 0],
              },

              total_paid_amount: {
                $ifNull: ["$payment_info.total_paid_amount", 0],
              },

              total_paid_installments: {
                $ifNull: ["$paid_installments", 0],
              },

              scheme_type: "$scheme_type.scheme_type",
              scheme_type_name: "$scheme_type.scheme_typename",
              id_metal: "$metal.id_metal",
              benefit_bonus: {
                $let: {
                  vars: {
                    totalPaid: {
                      $ifNull: ["$payment_info.total_paid_amount", 0],
                    },
                    returnAmount: {
                      $ifNull: ["$close_bill_info.return_amount", 0],
                    },
                  },
                  in: {
                    $cond: [
                      // 🔥 FIRST: Check Preclose
                      { $eq: ["$status", 3] },

                      // 👉 If Preclose → ONLY this logic runs
                      {
                        $max: [
                          { $subtract: ["$$returnAmount", "$$totalPaid"] },
                          0,
                        ],
                      },

                      // 👉 ELSE → Normal Bonus Logic
                      {
                        $cond: [
                          { $in: ["$scheme.scheme_type", [10, 14]] },
                          0,
                          {
                            $cond: [
                              { $eq: ["$scheme.bonus_type", 1] },
                              { $ifNull: ["$scheme.bonus_amount", 0] },
                              {
                                $cond: [
                                  { $eq: ["$scheme.bonus_type", 2] },
                                  {
                                    $multiply: [
                                      "$$totalPaid",
                                      {
                                        $divide: [
                                          {
                                            $ifNull: [
                                              "$scheme.bonus_percent",
                                              0,
                                            ],
                                          },
                                          100,
                                        ],
                                      },
                                    ],
                                  },
                                  0,
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
              isChitRedeem: {
                $ifNull: ["$close_bill_info.chitRedeemed", false],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          customer_info: 1,
          scheme_info: 1,
        },
      },
    ];

    const result = await schemeAccountModel.aggregate(pipeline);

    if (result.length > 0) {
      return result[0];
    } else {
      return result;
    }
  }

  async findByAccNumber(scheme_acc_number) {
    const pipeline = [
      {
        $match: {
          scheme_acc_number: scheme_acc_number,
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
                    { $eq: ["$is_deleted", false] },
                    { $eq: ["$payment_status", 1] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                total_paid_amount: { $sum: "$payment_amount" },
              },
            },
          ],
          as: "payment_info",
        },
      },
      {
        $unwind: {
          path: "$payment_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          id_branch: 1,
          status: 1,
          totalAmountPaid: { $ifNull: ["$payment_info.total_paid_amount", 0] },
        },
      },
    ];

    const result = await schemeAccountModel.aggregate(pipeline);
    return result[0] || null;
  }

  async findPreClose(id_scheme_account) {
    return await closeAccBillModel.findOne({
      id_scheme_account,
      active: 1,
    });
  }

  async updatePreCloseBill(id_scheme_account, data) {
    return await closeAccBillModel.findOneAndUpdate(
      { id_scheme_account, active: 1 },
      data,
      { new: true }
    );
  }

  async getPaymentModes(filter) {
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "paymentmodes",
          localField: "id_payment_mode",
          foreignField: "_id",
          as: "mode_info",
        },
      },
      { $unwind: "$mode_info" },
      {
        $group: {
          _id: "$mode_info.mode_name",
          total_amount: { $sum: "$payment_amount" },
        },
      },
    ];

    return await paymentModel.aggregate(pipeline);
  }

  async paymentHistory(filter, skip, limit) {
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "schemeaccounts",
          localField: "id_scheme_account",
          foreignField: "_id",
          as: "scheme_account",
        },
      },
      { $unwind: "$scheme_account" },
      {
        $lookup: {
          from: "customers",
          localField: "scheme_account.id_customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $lookup: {
          from: "paymentmodes",
          localField: "id_payment_mode",
          foreignField: "_id",
          as: "payment_mode",
        },
      },
      { $unwind: "$payment_mode" },
      {
        $project: {
          bill_no: 1,
          payment_amount: 1,
          createdAt: 1,
          scheme_acc_number: "$scheme_account.scheme_acc_number",
          customer_name: { $concat: ["$customer.firstname", " ", "$customer.lastname"] },
          payment_mode: "$payment_mode.mode_name",
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    const result = await paymentModel.aggregate(pipeline);
    return {
      total: result[0]?.metadata[0]?.total || 0,
      data: result[0]?.data || [],
    };
  }

  async closeAccount(data) {
    const { id_scheme_account, chitRedeemedBy, chitRedeemed } = data;
    const result = await closeAccBillModel.findOneAndUpdate(
      { id_scheme_account, active: 1 },
      { chitRedeemedBy, chitRedeemed },
      { new: true }
    );
    return result;
  }

  async dayBookReport({ from_date, to_date, branchId }) {
    const pipeline = [
      {
        $match: {
          active: 1,
          chitRedeemed: true,
          bill_date: {
            $gte: new Date(from_date),
            $lte: new Date(to_date),
          },
          ...(branchId ? { id_branch: mongoose.Types.ObjectId(branchId) } : {}),
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
          from: "customers",
          localField: "schemeAccount.id_customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          bill_no: 1,
          bill_date: 1,
          return_amount: 1,
          chitRedeemedBy: 1,
          customer_name: { $concat: ["$customer.firstname", " ", "$customer.lastname"] },
          mobile: "$customer.mobile",
          scheme_acc_number: "$schemeAccount.scheme_acc_number",
        },
      },
    ];

    return await closeAccBillModel.aggregate(pipeline);
  }
}

export default ChitRedeemRepository;
