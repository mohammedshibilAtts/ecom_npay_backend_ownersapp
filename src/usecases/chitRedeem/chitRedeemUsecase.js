class ChitRedeemUsecase {
  constructor(
    chitRedeemRepository,
    schemeAccountUsecase,
    customerRepository,
    walletRepository,
    dashboardRepository,
    walletUsecase,
  ) {
    this.chitRedeemRepository = chitRedeemRepository;
    this.schemeAccountUsecase = schemeAccountUsecase;
    this.customerRepository = customerRepository;
    this.walletRepository = walletRepository;
    this.dashboardRepository = dashboardRepository;
    this.walletUsecase = walletUsecase;
  }

  async findSchemeAccount({ mobile, scheme_acc_number }) {
    if (!mobile && !scheme_acc_number) {
      return {
        success: false,
        message: "Mobile or Scheme Account no is required",
      };
    }

    const query = {};
    if (mobile) {
      query.mobile = mobile;
    }
    if (scheme_acc_number) {
      query.scheme_acc_number = scheme_acc_number;
    }

    const schemeAccount =
      await this.chitRedeemRepository.findSchemeAccount(query);

    if (!schemeAccount) {
      return {
        success: false,
        message: "Scheme account not found",
      };
    }

    return {
      success: true,
      data: schemeAccount,
    };
  }

  async closeAccount(data) {
    try {
      const {
        billNo,
        closedBy,
        schemeDetails,
        billDate = new Date(),
        customer_id,
        wallet_amount,
      } = data || {};

      const validations = [
        { condition: !billNo?.trim(), message: "Bill No is required" },
        { condition: !closedBy, message: "Closed By is required" },
        {
          condition:
            !Array.isArray(schemeDetails) || schemeDetails.length === 0,
          message: "At least one scheme account is required",
        },
      ];

      const error = validations.find((v) => v.condition);

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      let findWallet;
      if (customer_id) {
        findWallet = await this.walletRepository.findWallet({
          id_customer: customer_id,
        });
        if (!findWallet) {
          return {
            success: false,
            message: "Wallet not found",
          };
        }
        if (wallet_amount > findWallet?.balance_amt) {
          return {
            success: false,
            message: `Insufficient wallet balance. Available balance is ${findWallet.balance_amt}.`,
          };
        }
      }

      for (const scheme of schemeDetails) {
        const accNumber = scheme?.scheme_acc_number?.trim();

        if (!accNumber) {
          return {
            success: false,
            message: "Scheme Account Number is required for all schemes",
          };
        }

        const existingScheme =
          await this.chitRedeemRepository.findByAccNumber(accNumber);

        if (!existingScheme) {
          return {
            success: false,
            message: `Scheme account ${accNumber} not found`,
          };
        }

        if (existingScheme.status === 1) {
          return {
            success: false,
            message: `Scheme account ${accNumber} is already closed`,
          };
        }

        if (existingScheme.status === 3) {
          const findPreClose = await this.chitRedeemRepository.findPreClose(
            existingScheme._id,
          );

          if (!findPreClose) {
            return {
              success: false,
              message: `Preclose record not found for ${accNumber}`,
            };
          }

          if (findPreClose?.chitRedeemed) {
            return {
              success: false,
              message: `Scheme account ${accNumber} already redeemed`,
            };
          }

          await this.chitRedeemRepository.updatePreCloseBill(
            existingScheme._id,
            {
              bill_no: billNo,
              bill_date: billDate,
              comments: "chit redemption",
              chitRedeemed: true,
              chitRedeemedBy: closedBy,
              closed_by: null,
            },
          );

          continue;
        }

        await this.schemeAccountUsecase.closeSchemeAccount(
          existingScheme._id,
          {
            status: 1,
            id_scheme_account: existingScheme._id,
            id_branch: existingScheme.id_branch,
            comments: "Scheme account closed through chit redemption",
            bill_no: billNo,
            bill_date: billDate,
            total_paidamount: existingScheme.totalAmountPaid,
            refund_paymenttype: false,
            closingBonus: 0,
            chitRedeemed: true,
            chitRedeemedBy: closedBy,
            closed_by: null,
          },
          null,
          true,
        );
      }

      if (customer_id && wallet_amount > 0) {
        const updateData = {
          redeem_amt: wallet_amount,
          wallet_id: findWallet?._id,
          redeem_type: null,
          modified_by: null,
          payment_mode: null,
          bill_no: billNo,
        };

        await this.walletUsecase.redeemFromWallet(
          updateData,
          null,
        );
      }

      return {
        success: true,
        message: "Redeemed successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Failed to Close Account",
      };
    }
  }

  async dayBookReport(data) {
    try {
      const { date, page = 1, limit = 10 } = data;
      if (!date) {
        return {
          success: false,
          message: "Date Required",
        };
      }
      const inputDate = new Date(date);

      const startDate = new Date(inputDate);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(inputDate);
      endDate.setUTCHours(23, 59, 59, 999);

      const query = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      const pageNum = page ? parseInt(page) : 1;
      const pageSize = limit ? parseInt(limit) : 10;
      const skip = (pageNum - 1) * pageSize;
      const filter = { payment_status: 1, ...query };

      const paymentModes =
        await this.chitRedeemRepository.getPaymentModes(filter);

      const historyResult = await this.chitRedeemRepository.paymentHistory(
        filter,
        skip,
        pageSize,
      );

      return {
        success: true,
        data: {
          summary: paymentModes,
          history: historyResult.data,
          pagination: {
            currentPage: pageNum,
            limit: pageSize,
            totalRecords: historyResult.total,
            totalPages: Math.ceil(historyResult.total / pageSize),
          },
        },
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Failed to get report",
      };
    }
  }
}

export default ChitRedeemUsecase;
