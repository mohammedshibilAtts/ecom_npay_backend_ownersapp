import mongoose from "mongoose";

const couponHistorySchema = new mongoose.Schema(
  {
    idSchemeAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchemeAccount",
      required: true,
    },

    idCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    idPurchaseWalletHistory: {
      // Which wallet history entry caused coupon generation
      type: mongoose.Schema.Types.ObjectId,
      ref: "purchasewallethistories",
      required: true,
    },

    couponQuantity: {
      // How many coupons issued/released (usually 1, but scalable)
      type: Number,
      required: true,
    },

    weightAtIssuing: {
      // How much weight was saved at the time of issuing
      type: Number,
      required: true,
    },

    status: {
      // 1 = available
      // 2 = issued 
      type: Number,
      enum: [1, 2],
      default: 1,
    },

    issuedDate: {
      type: Date,
    },

    remarks: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },
    updatedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("couponhistories", couponHistorySchema);
