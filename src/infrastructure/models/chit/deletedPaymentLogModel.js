import mongoose from "mongoose";

const deletedPaymentLogSchema = new mongoose.Schema(
  {
    id_payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    id_scheme_account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchemeAccount",
      required: true,
    },
    payment_amount: {
      type: Number,
      required: true,
    },
    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    reversals: {
      referral_reverted: { type: Boolean, default: false },
      referral_amount_debited: { type: Number, default: 0 },
      wallet_impacted: { type: Boolean, default: false },
      wallet_owner: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // or Employee
      scheme_stats_reverted: { type: Boolean, default: false },
    },
    snapshot: {
      type: Object, // Store snapshot of the payment data before deletion
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("DeletedPaymentLog", deletedPaymentLogSchema);
