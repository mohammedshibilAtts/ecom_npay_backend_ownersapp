import PurchaseWallet from "../../models/chit/purcahseWalletModel.js";
import PurchaseWalletHistory from "../../models/chit/purchaseWalletHistoryModel.js";
import couponHistoriesModel from "../../models/chit/couponHistoriesModel.js";
import mongoose from "mongoose";

class PurchaseWalletRepository {
  async createOrGetWallet(customerId, mobile, session) {
    const options = session ? { session } : {};
    let wallet = await PurchaseWallet.findOne(
      { idCustomer: customerId, is_deleted: false },
      null,
      options
    );

    if (!wallet) {
      const payload = {
        idCustomer: customerId,
        mobile,
        totalWeightSaved: 0,
        currentBalance: 0,
        pendingReleaseWeight: 0,
        couponReleasedCount: 0,
        is_deleted: false,
      };

      if (session) {
        const created = await PurchaseWallet.create([payload], options);
        wallet = created[0];
      } else {
        wallet = await PurchaseWallet.create(payload);
      }
    }

    return wallet;
  }

  async _performAddWeight({ idSchemeAccount, idCustomer, mobile, weight }, session) {
    const activeSession = session || null;
    const wallet = await this.createOrGetWallet(idCustomer, mobile, activeSession);

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

    if (activeSession) {
      await wallet.save({ session: activeSession });
    } else {
      await wallet.save();
    }

    const historyPayload = {
      idSchemeAccount,
      idPurchaseWallet: wallet._id,
      weightSaved: weight,
      previousBalance,
      newBalance: wallet.currentBalance,
      couponsReleased: couponsToRelease,
      status: 1,
      remarks: couponsToRelease > 0 ? "Auto coupon released" : "",
    };

    let history;
    if (activeSession) {
      const [createdHistory] = await PurchaseWalletHistory.create([historyPayload], { session: activeSession });
      history = createdHistory;
    } else {
      history = await PurchaseWalletHistory.create(historyPayload);
    }

    return { wallet, history };
  }

  async addWeight({ idSchemeAccount, idCustomer, mobile, weight }) {
    let session = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      const result = await this._performAddWeight({ idSchemeAccount, idCustomer, mobile, weight }, session);
      await session.commitTransaction();
      session.endSession();
      return result;
    } catch (error) {
      if (session) {
        try {
          await session.abortTransaction();
        } catch (e) {}
        session.endSession();
      }

      if (error?.code === 20 || error?.errmsg?.includes("Transaction numbers are only allowed")) {
        return await this._performAddWeight({ idSchemeAccount, idCustomer, mobile, weight }, null);
      }

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
      { new: true },
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
          select: "firstname lastname mobile",
        })
        .populate({
          path: "idSchemeAccount",
          select: "scheme_acc_number",
        })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      couponHistoriesModel.countDocuments({}),
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
        },
      );

      return updatedCoupon;
    } catch (error) {
      console.error("Repository issueCoupon Error:", error);
      throw error;
    }
  }

  async couponStatus(schemeAccId) {
    try {
      return await couponHistoriesModel.findOne({
        idSchemeAccount: schemeAccId,
        status: 2,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default PurchaseWalletRepository;
