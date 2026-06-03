import PurchaseWalletRepository from "../../../../infrastructure/repositories/chit/purchaseWalletRepository.js";
import SchemeAccountRepo from "../../../../infrastructure/repositories/chit/schemeAccountRepository.js";
class PurchaseWalletUsecase {
  constructor() {
    this.purchaseWalletRepo = new PurchaseWalletRepository();
    this.schemeAccRepo = new SchemeAccountRepo();
  }

  async addWeight({ idSchemeAccount, idCustomer, mobile, weight }) {
    try {
      const dataToProcess = {
        2000: 2,
        4000: 4,
      };

      //   const couponIssuedStatus = await this.purchaseWalletRepo.couponStatus(idSchemeAccount)

      //   if(couponIssuedStatus){
      //     return { status: false, message: "Coupon already issued for this scheme account" };
      //   }

      if (!idSchemeAccount || !idCustomer || !weight) {
        return { status: false, message: "Missing required fields" };
      }

      const schemeAccountData = await this.schemeAccRepo.findById(
        idSchemeAccount
      );
      if (!schemeAccountData) {
        return { status: false, message: "Scheme account not found" };
      }

      const threshold = dataToProcess[Number(schemeAccountData.flexFixed)];
      if (!threshold) {
        return {
          status: false,
          message: "Invalid flexFixed or threshold not set",
        };
      }

      const previousTotal =
        await this.purchaseWalletRepo.getTotalWeightBySchemeAccount(
          idSchemeAccount
        );

      const { wallet, history } = await this.purchaseWalletRepo.addWeight({
        idSchemeAccount,
        idCustomer,
        mobile,
        weight,
      });

      const newTotal = previousTotal + Number(weight);
      let couponHistory = null;

      if (newTotal >= threshold && previousTotal < threshold) {
        couponHistory = await this.purchaseWalletRepo.createCouponHistory({
          idSchemeAccount,
          idPurchaseWalletHistory: history._id,
          couponQuantity: 1,
          weightAtIssuing: newTotal,
          status: 1,
          idCustomer,
          remarks: `Coupon auto released when weight reached ${newTotal}g`,
        });
      }

      return {
        status: true,
        message: "Weight added successfully",
        wallet,
        history,
        coupon: couponHistory,
      };
    } catch (error) {
      console.error("PurchaseWalletUsecase.addWeight Error:", error);
      return {
        status: false,
        message: "Failed to add weight",
        error,
      };
    }
  }

  async getWalletByCustomer(customerId) {
    try {
      const wallet = await this.purchaseWalletRepo.getWalletByCustomer(
        customerId
      );
      if (!wallet) {
        return { status: false, message: "Wallet not found" };
      }

      return { status: true, wallet };
    } catch (error) {
      console.error("PurchaseWalletUsecase.getWalletByCustomer Error:", error);
      return {
        status: false,
        message: "Failed to fetch wallet",
        error,
      };
    }
  }

  async getHistoryByWallet(walletId) {
    try {
      const history = await this.purchaseWalletRepo.getHistoryByWallet(
        walletId
      );
      return { status: true, history };
    } catch (error) {
      console.error("PurchaseWalletUsecase.getHistoryByWallet Error:", error);
      return {
        status: false,
        message: "Failed to fetch wallet history",
        error,
      };
    }
  }

  async revertHistory(historyId) {
    try {
      const reverted = await this.purchaseWalletRepo.revertHistory(historyId);
      return { status: true, reverted };
    } catch (error) {
      console.error("PurchaseWalletUsecase.revertHistory Error:", error);
      return {
        status: false,
        message: "Failed to revert history",
        error,
      };
    }
  }

  async couponHistory(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const { data, total } = await this.purchaseWalletRepo.couponHistory(
        userId,
        { skip, limit }
      );

      const totalPages = Math.ceil(total / limit);

      return {
        status: true,
        page,
        limit,
        total,
        totalPages,
        data,
      };
    } catch (error) {
      console.error("PurchaseWalletUsecase.couponHistory Error:", error);
      return {
        status: false,
        message: "Failed to fetch coupon history",
        error,
      };
    }
  }

  async issueCoupon(id, token) {
    try {
      const updatedCouponData = await this.purchaseWalletRepo.issueCoupon(id, token?.employee);

      if (!updatedCouponData) {
        return {
          status: false,
          message: "Coupon not found or already processed"
        };
      }

      return {
        status: true,
        message: "Coupon issued successfully",
        data: updatedCouponData
      };
    } catch (error) {
      console.error("PurchaseWalletUsecase.issueCoupon Error:", error);
      return {
        status: false,
        message: "Failed to issue coupon",
        error: error.message
      };
    }
  }
}

export default PurchaseWalletUsecase;