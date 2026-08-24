import mongoose from "mongoose";
import paymentModel from "../../models/chit/paymentModel.js";
import referralListModel from "../../models/chit/referralListModel.js";
import walletModel from "../../models/chit/walletModel.js";

class PaymentRepository {
  async findPaymentData(id_scheme_account) {
    try {
      const paymentData = await paymentModel
        .findOne({
          id_scheme_account: id_scheme_account,
          active: true,
          payment_status: 1,
        })
        .sort({ _id: -1 })
        .limit(1)
        .populate({
          path: "id_scheme_account",
          select: "start_date",
        })
        .populate("payment_mode")
        .lean()
        .exec();

      if (!paymentData) {
        return null;
      }

      return paymentData;
    } catch (error) {
      console.error(error);
    }
  }

  // async lastPayment(schemeId) {
  //   try {
  //     const lastPayment = await paymentModel
  //       .findOne({ id_scheme: schemeId })
  //       .sort({ payment_receipt: -1 })
  //       .select("payment_receipt");

  //     if (!lastPayment) {
  //       return null;
  //     }

  //     return lastPayment;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  async lastPayment(schemeId) {
    try {
      const lastPayment = await paymentModel
        .findOne({ id_scheme: schemeId })
        .sort({ _id: -1 })
        .select("payment_receipt");

      return lastPayment || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addPayment(data) {
    try {
      const savedData = await paymentModel.create(data);

      if (!savedData) {
        return null;
      }

      return savedData;
    } catch (error) {
      console.error(error);
    }
  }

  async countDocuments(schemeAccountId) {
    try {
      const documents = await paymentModel.countDocuments({
        active: true,
        payment_status: 1,
        id_scheme_account: schemeAccountId,
      });

      return documents || 0;
    } catch (error) {
      console.error(error);
    }
  }

  async findById(id) {
    try {
      const documents = await paymentModel
        .findById(id)
        .populate([
          {
            path: "id_scheme",
          },
          {
            path: "id_customer",
          },
          {
            path: "id_scheme_account",
          },
        ])
        .lean();

      if (!documents) {
        return null;
      }

      return documents;
    } catch (error) {
      console.error(error);
    }
  }

  async paymentTable(query, skip, limit) {
    try {
      const documents = await paymentModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate([
          {
            path: "id_scheme",
            select:
              "scheme_name amount min_amount max_amount min_weight max_weight scheme_type id_metal id_purity min_fund max_fund",
          },
          {
            path: "id_customer",
            select: "customer_name email mobile",
          },
          {
            path: "id_branch",
            select: "branch_name",
          },
          {
            path: "id_scheme_account",
            populate: {
              path: "id_classification",
              select: "classification_name",
            },
          },
          {
            path: "payment_mode",
            select: "mode_name",
          },
        ])
        .select("-__v")
        .lean()
        .exec();

      const totalCount = await paymentModel.countDocuments(query);

      if (!documents || documents.length === 0) {
        return null;
      }

      return { documents, totalCount };
    } catch (error) {
      console.error("Error in fetching payment table:", error);
      return null;
    }
  }

  async aggregate(filter) {
    try {
      const data = paymentModel.aggregate(filter);

      return data || [];
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(query) {
    try {
      const data = paymentModel
        .findOne(query)
        .sort({ date_payment: -1 })
        .limit(1)
        .exec();

      return data || null;
    } catch (error) {
      console.error(error);
    }
  }

  async find(id) {
    try {
      const data = paymentModel
        .find({ id_scheme_account: id, active: true, payment_status: 1 })
        .sort("payment_receipt");

      return data || [];
    } catch (error) {
      console.error(error);
    }
  }

  async findNew(query) {
    try {
      const data = paymentModel.find(query);

      return data || [];
    } catch (error) {
      console.error(error);
    }
  }

  async getPaymentsBySchemeId(query, skip, limit, isMobile,all=false) {
    try {
      let documents;
      if (isMobile) {
        if (all) {
          documents = await paymentModel
            .find(query)
            // .populate({
            //   path: "id_scheme_account",
            //   populate: {
            //     path: "id_scheme",
            //     select: ["scheme_name"],
            //   },
            // })
            .populate({
              path: "id_scheme_account",
              select: ["start_date", "id_scheme", "scheme_acc_number"],
              populate: {
                path: "id_scheme",
                select: ["scheme_name"],
              },
            })
           .select("payment_amount id_transaction paymentModeName metal_weight metal_rate createdAt date_payment digiBonus")
            .sort({ _id: -1 });
        } else {
          if (
            skip &&
            typeof skip === "string" &&
            skip.length === 24 &&
            mongoose.isValidObjectId(skip)
          ) {
            query._id = { $lt: skip };
          }
          documents = await paymentModel
            .find(query)
            .limit(limit)
            .populate({
              path: "id_scheme_account",
              select: ["start_date", "id_scheme", "scheme_acc_number"],
              populate: {
                path: "id_scheme",
                select: ["scheme_name"],
              },
            })
            .select("payment_amount id_transaction paymentModeName metal_weight metal_rate createdAt date_payment digiBonus")
            .sort({ _id: -1 });
        }
      } else {
        documents = await paymentModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .populate("id_customer")
          .populate("id_scheme")
          .populate("id_scheme_account")
          .select("-__v")
          .sort({ _id: -1 });
      }

      if (!documents || documents.length === 0) {
        return null;
      }

      const totalCount = await paymentModel.countDocuments(query);

      let updatedDocuments;
      let nextCursor = null;
      if (!isMobile) {
        // updatedDocuments = await Promise.all(
        //   documents.map(async (doc) => {
        //     const wallet = await walletModel
        //       .findOne({ id_customer: doc.id_customer._id })
        //       .select("-__v");
        //     return {
        //       ...doc.toObject(),
        //       wallet,
        //     };
        //   }),
        // );
      } else {
        updatedDocuments = documents.map((doc) => {
          let docObj = doc.toObject ? doc.toObject() : doc;
          let savedWeight = 0;
          let bonusWeight = 0;
          let totalWeight = docObj.metal_weight ? parseFloat(docObj.metal_weight) : 0;
          
          if (docObj.metal_rate > 0) {
            savedWeight = docObj.payment_amount / docObj.metal_rate;
            if (docObj.digiBonus > 0) {
              bonusWeight = (docObj.payment_amount * docObj.digiBonus / 100) / docObj.metal_rate;
              totalWeight = savedWeight + bonusWeight;
            }
          }
          
          return {
            ...docObj,
            savedWeight,
            bonusWeight,
            totalWeight
          };
        });

        if (documents.length === limit) {
          nextCursor = documents[documents.length - 1]._id;
        }
      }

      return { documents: updatedDocuments, totalCount, nextCursor };
    } catch (error) {
      console.error(error);
      throw error; // Optional: bubble up the error
    }
  }

  async getPaymentsBySchemeIdWeb(query, skip, limit, all = false) {
    try {
      if (query.id_scheme_account && typeof query.id_scheme_account === 'string') {
        query.id_scheme_account = new mongoose.Types.ObjectId(query.id_scheme_account);
      }

      const pipeline = [
        { $match: query },
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            payment_receipt: 1,
            paid_installments: 1,
            payment_amount: 1,
            metal_rate: 1,
            digiBonus: 1,
            metal_weight: 1,
            createdAt: 1,
            savedWeight: {
              $cond: {
                if: { $gt: ["$metal_rate", 0] },
                then: { $divide: ["$payment_amount", "$metal_rate"] },
                else: 0
              }
            },
            bonusWeight: {
              $cond: {
                if: { $and: [{ $gt: ["$digiBonus", 0] }, { $gt: ["$metal_rate", 0] }] },
                then: {
                  $divide: [
                    { $multiply: ["$payment_amount", { $divide: ["$digiBonus", 100] }] },
                    "$metal_rate"
                  ]
                },
                else: 0
              }
            }
          }
        },
        {
          $addFields: {
            totalWeight: {
              $cond: {
                if: { $gt: ["$digiBonus", 0] },
                then: { $add: ["$savedWeight", "$bonusWeight"] },
                else: {
                  $convert: {
                    input: "$metal_weight",
                    to: "double",
                    onError: 0,
                    onNull: 0
                  }
                }
              }
            }
          }
        }
      ];

      const documents = await paymentModel.aggregate(pipeline);

      if (!documents || documents.length === 0) {
        return null;
      }

      const totalCount = await paymentModel.countDocuments(query);

      return { documents, totalCount, nextCursor: null };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async totalInstallments(id) {
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      const result = await paymentModel.aggregate([
        {
          $match: {
            id_scheme_account: objectId,
            active: true,
            payment_status: 1,
          },
        },
        {
          $group: {
            _id: null,
            totalPaidInstallments: { $sum: "$paid_installments" },
          },
        },
      ]);

      if (result.length === 0) {
        return 0;
      }

      return result[0].totalPaidInstallments;
    } catch (error) {
      console.error("Error calculating paid installments:", error);
      return 0;
    }
  }

  async addReferralPoint(data) {
    try {
      const output = await referralListModel.create(data);

      if (output) {
        return true;
      }

      return null;
    } catch (error) {
      console.error(error);
    }
  }

  async getMonthlyPayments(data) {
    try {
      const objectId = new mongoose.Types.ObjectId(data.id);
      const inputDate = data.date;

      const startOfMonth = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth() + 1,
        1,
      );

      const result = await paymentModel.aggregate([
        {
          $match: {
            active: true,
            payment_status: 1,
            id_scheme_account: objectId,
            date_payment: { $gte: startOfMonth, $lt: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalPaidInstallments: { $sum: "$paid_installments" },
          },
        },
      ]);

      if (result.length === 0) {
        return 0;
      }

      return result[0].totalPaidInstallments;
    } catch (error) {
      console.error("Error calculating paid installments:", error);
      return 0;
    }
  }

  async updateUniversal(query) {
    try {
      const output = await referralListModel.updateMany(query);

      if (output) {
        return true;
      }

      return null;
    } catch (error) {
      console.error(error);
    }
  }

  async bulkWrite(bulkOps) {
    try {
      const updatedData = await paymentModel.bulkWrite(bulkOps);

      if (updatedData.matchedCount === 0) {
        return null;
      }

      return updatedData;
    } catch (error) {
      console.error(error);
    }
  }

  async softDeletePayment(paymentId, deletedBy, reason) {
    try {
      const updatedData = await paymentModel.findByIdAndUpdate(
        paymentId,
        {
          $set: {
            is_deleted: true,
            active: false,
            payment_status: 2,
            deleted_by: deletedBy,
            deleted_at: new Date(),
            deletion_reason: reason,
          },
        },
        { new: true },
      );
      return updatedData;
    } catch (error) {
      console.error("Error soft deleting payment:", error);
      return null;
    }
  }

  async lastPaymentReciept() {
    try {
      const lastPayment = await paymentModel
        .findOne()
        .sort({ createdAt: -1 })
        .select("payment_receipt");

      return lastPayment || null;
    } catch (error) {
      console.error("Error fetching last payment:", error);
      throw error;
    }
  }
  async getReferralByPayment(paymentId) {
    try {
      return await referralListModel.findOne({
        id_payment: paymentId,
        active: true,
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async softDeleteReferral(id) {
    try {
      return await referralListModel.findByIdAndUpdate(id, {
        $set: { is_deleted: true, active: false },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default PaymentRepository;
