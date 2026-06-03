import PurchaseWallet from "../../models/chit/purcahseWalletModel.js";
import PurchaseWalletHistory from "../../models/chit/purchaseWalletHistoryModel.js";
import couponHistoriesModel from "../../models/chit/couponHistoriesModel.js";
import mongoose from "mongoose";

class PurchaseWalletRepository {
  async createOrGetWallet(customerId, mobile, session) {
    let wallet = await PurchaseWallet.findOne(
      { idCustomer: customerId, is_deleted: false },
      null,
      { session }
    );

    if (!wallet) {
      const created = await PurchaseWallet.create(
        [
          {
            idCustomer: customerId,
            mobile,
            totalWeightSaved: 0,
            currentBalance: 0,
            pendingReleaseWeight: 0,
            couponReleasedCount: 0,
            is_deleted: false,
          },
        ],
        { session }
      );

      wallet = created[0];
    }

    return wallet;
  }

  async addWeight({ idSchemeAccount, idCustomer, mobile, weight }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const wallet = await this.createOrGetWallet(idCustomer, mobile, session);

      const previousBalance = wallet.currentBalance;

      wallet.totalWeightSaved += weight;
      wallet.currentBalance += weight;

      const total = wallet.currentBalance + wallet.pendingReleaseWeight;
      const couponWeight = 2;
      const couponsToRelease = Math.floor(total / couponWeight);

      if (couponsToRelease > 0) {
        wallet.couponReleasedCount += couponsToRelease;
        wallet.lastReleasedAt = new Date();
      }

      wallet.pendingReleaseWeight = total % couponWeight;
      wallet.currentBalance = wallet.pendingReleaseWeight;

      await wallet.save({ session });

      const [history] = await PurchaseWalletHistory.create(
        [
          {
            idSchemeAccount,
            idPurchaseWallet: wallet._id,
            weightSaved: weight,
            previousBalance,
            newBalance: wallet.currentBalance,
            couponsReleased: couponsToRelease,
            status: 1,
            remarks: couponsToRelease > 0 ? "Auto coupon released" : "",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return { wallet, history };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getWalletByCustomer(customerId) {
    return await PurchaseWallet.findOne({
      idCustomer: customerId,
      is_deleted: false,
    });
  }

  async getHistoryByWallet(walletId) {
    return await PurchaseWalletHistory.find({
      idPurchaseWallet: walletId,
      is_deleted: false,
    }).sort({ _id: -1 });
  }

  async revertHistory(historyId) {
    return await PurchaseWalletHistory.findByIdAndUpdate(
      historyId,
      { status: 3, remarks: "Reverted" },
      { new: true }
    );
  }

  async getTotalWeightBySchemeAccount(idSchemeAccount) {
    const result = await PurchaseWalletHistory.aggregate([
      {
        $match: {
          idSchemeAccount: new mongoose.Types.ObjectId(idSchemeAccount),
          is_deleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalWeight: { $sum: "$weightSaved" },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalWeight : 0;
  }

  async createCouponHistory({
    idSchemeAccount,
    idPurchaseWalletHistory,
    couponQuantity,
    idCustomer,
    weightAtIssuing,
    status = 1,
    remarks = "",
  }) {
    try {
      const coupon = await couponHistoriesModel.create({
        idSchemeAccount,
        idPurchaseWalletHistory,
        couponQuantity,
        weightAtIssuing,
        idCustomer,
        status,
        remarks,
      });

      return coupon;
    } catch (error) {
      console.error("Error creating coupon history:", error);
      throw error;
    }
  }

  async couponHistory(userId, { skip, limit }) {
    const [data, total] = await Promise.all([
      couponHistoriesModel
        .find({})
        .populate({
          path: "idCustomer",
          select: "firstname lastname mobile"
        })
        .populate({
          path: "idSchemeAccount",
          select: "scheme_acc_number"
        })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      couponHistoriesModel.countDocuments({})
    ]);

    return { data, total };
  }


  async issueCoupon(id, employeeId) {
    try {
      const updatedCoupon = await couponHistoriesModel.findOneAndUpdate(
        {
          _id: id,
          status: 1,
        },
        {
          status: 2,
          updatedBy: employeeId,
          issuedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return updatedCoupon;
    } catch (error) {
      console.error("Repository issueCoupon Error:", error);
      throw error;
    }
  }

  async couponStatus(schemeAccId) {
    try {
      return await couponHistoriesModel.findOne({ idSchemeAccount: schemeAccId, status: 2 })
    } catch (error) {
      console.error(error)
      throw error;
    }
  }
}

export default PurchaseWalletRepository;
