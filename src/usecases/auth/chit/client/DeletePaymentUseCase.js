import DeletedPaymentLogRepository from "../../../../infrastructure/repositories/chit/deletedPaymentLogRepository.js";

class DeletePaymentUseCase {
  constructor(
    paymentRepository,
    schemeAccountRepository,
    walletRepository,
    transactionRepository,
    transactionDetailsRepository,
  ) {
    this.paymentRepository = paymentRepository;
    this.schemeAccountRepository = schemeAccountRepository;
    this.walletRepository = walletRepository;
    this.transactionRepository = transactionRepository;
    this.transactionDetailsRepository = transactionDetailsRepository;
    this.deletedPaymentLogRepository = new DeletedPaymentLogRepository();
  }

  async execute(paymentId, employeeId, reason) {
    try {

      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        return { success: false, message: "Payment not found" };
      }

      if (payment.active === false || payment.is_deleted === true || payment?.status === 2) {
        return { success: false, message: "Payment is already deleted or inactive" };
      }

      const paymentSnapshot = { ...payment };
      const logData = {
        id_payment: payment._id,
        id_scheme_account: payment.id_scheme_account?._id,
        payment_amount: payment.payment_amount,
        deleted_by: employeeId,
        reason: reason,
        snapshot: paymentSnapshot,
        reversals: {
          referral_reverted: false,
          referral_amount_debited: 0,
          wallet_impacted: false,
          scheme_stats_reverted: false,
        },
      };

      const referralEntry =
        await this.paymentRepository.getReferralByPayment(paymentId);

      if (referralEntry) {
        const walletId = await this.walletRepository.findWallet({
          mobile: referralEntry.mobile,
        }); 

        let wallet = null;
        if (referralEntry.id_customer) {
          wallet = await this.walletRepository.findWallet({
            id_customer: referralEntry.id_customer,
          });
        } else if (referralEntry.id_employee) {
          wallet = await this.walletRepository.findWallet({
            id_employee: referralEntry.id_employee,
          });
        } else if (referralEntry.mobile) {
          wallet = await this.walletRepository.findWallet({
            mobile: referralEntry.mobile,
          });
        }

        if (wallet) {
          const debitAmount = referralEntry.credited_amount;
          await this.walletRepository.debitAmount(wallet._id, debitAmount);

          await this.walletRepository.addDebitEntry({
            wallet_id: wallet._id,
            credited_amount: -debitAmount,
            reward_mode: referralEntry.reward_mode,
            created_by: employeeId,
            bill_no: "REVERSAL-" + payment.payment_receipt, // Track reversal
          });

          logData.reversals.wallet_impacted = true;
          logData.reversals.wallet_owner =
            wallet.id_customer || wallet.id_employee;
          logData.reversals.referral_amount_debited = debitAmount;
        }

        // Soft delete referral entry
        await this.paymentRepository.softDeleteReferral(referralEntry._id);
        logData.reversals.referral_reverted = true;
      }

      // 3. Scheme Stats Reversal
      const schemeAccount = await this.schemeAccountRepository.findById(
        payment.id_scheme_account._id,
      );
      if (schemeAccount) {
        const newPaidContent =
          Number(schemeAccount.paid_installments) -
          Number(payment.paid_installments); // usually 1
        let newStatus = schemeAccount.status;
        if (schemeAccount.status === 2) {
          newStatus = 1; // Re-open
        }

        const previousPayment = await this.paymentRepository.findPaymentData(
          schemeAccount._id,
        );

        await this.schemeAccountRepository.updatePaymentCount({
          schemeAccountId: schemeAccount._id,
          paymentcount: Number(schemeAccount.paymentcount) - 1,
          paid_installments: newPaidContent,
          status: newStatus,
          last_paid_date: null, 
        });

        logData.reversals.scheme_stats_reverted = true;
      }

      if (payment.id_transaction) {
      }

      await this.paymentRepository.softDeletePayment(
        paymentId,
        employeeId,
        reason,
      );

      // 6. Log
      await this.deletedPaymentLogRepository.createLog(logData);

      return { success: true, message: "Payment deleted successfully" };
    } catch (error) {
      console.error("Error in DeletePaymentUseCase:", error);
      return { success: false, message: "Failed to delete payment" };
    }
  }
}

export default DeletePaymentUseCase;
