class PurchaseWalletController {
    constructor(purchaseWalletUsecase) {
        this.purchaseWalletUsecase = purchaseWalletUsecase;
    }

    async addWeight(req, res) {
        try {
            const token = req.user;
            const { idSchemeAccount, idCustomer, mobile, weight,idScheme} = req.body;

            if (!idSchemeAccount || !idCustomer || !weight) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const result = await this.purchaseWalletUsecase.addWeight({
                idSchemeAccount,
                idCustomer,
                mobile,
                weight,
                idScheme
            });

            return res.status(result.status ? 200 : 400).json({
                message: result.message,
                wallet: result.wallet,
                history: result.history
            });

        } catch (error) {
            console.error("Error in addWeight Controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getWalletByCustomer(req, res) {
        try {
            const { customerId } = req.params;

            if (!customerId) {
                return res.status(400).json({ message: "Customer ID required" });
            }

            const result = await this.purchaseWalletUsecase.getWalletByCustomer(customerId);

            return res.status(result.status ? 200 : 400).json({
                message: result.message,
                wallet: result.wallet
            });

        } catch (error) {
            console.error("Error in getWalletByCustomer:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getHistoryByWallet(req, res) {
        try {
            const { walletId } = req.params;

            if (!walletId) {
                return res.status(400).json({ message: "Wallet ID required" });
            }

            const result = await this.purchaseWalletUsecase.getHistoryByWallet(walletId);

            return res.status(result.status ? 200 : 400).json({
                message: result.message,
                history: result.history
            });

        } catch (error) {
            console.error("Error in getHistoryByWallet:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async revertHistory(req, res) {
        try {
            const { historyId } = req.params;

            if (!historyId) {
                return res.status(400).json({ message: "History ID required" });
            }

            const result = await this.purchaseWalletUsecase.revertHistory(historyId);

            return res.status(result.status ? 200 : 400).json({
                message: result.message,
                reverted: result.reverted
            });

        } catch (error) {
            console.error("Error in revertHistory:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async couponHistory(req, res) {
        try {
            const token = req.user;
    
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
    
            const result = await this.purchaseWalletUsecase.couponHistory(
                token?._id,
                page,
                limit
            );
    
            return res.status(result.status ? 200 : 400).json({
                status: result.status,
                message: result.message || "Coupon history fetched successfully",
                page: result.page,
                // limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
                data: result.data
            });
    
        } catch (error) {
            console.error("Error in couponHistory controller:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }    

    async issueCoupon(req, res) {
        try {
            const { id } = req.query;
            const token = req.user;
    
            if (!id) {
                return res.status(400).json({ message: "Coupon id is required" });
            }
    
            const result = await this.purchaseWalletUsecase.issueCoupon(id, token);
    
            if (result?.status) {
                return res.status(200).json({
                    message: "Coupon issued successfully",
                    status: true,
                    data: result.updatedCouponData || result.data
                });
            }
            
            return res.status(400).json({
                message: result?.message || "Failed to issue coupon",
                status: false
            });
    
        } catch (error) {
            console.error("Error in issueCoupon:", error);
            return res.status(500).json({ 
                message: "Internal server error",
                status: false 
            });
        }
    }
}

export default PurchaseWalletController;