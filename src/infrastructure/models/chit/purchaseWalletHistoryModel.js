import mongoose from "mongoose";

const purchaseWalletHistorySchema = new mongoose.Schema(
  {
    idSchemeAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schemeaccounts",
      required: true,
    },

    idPurchaseWallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "purchasewallets",
      required: true,
    },

    weightSaved: {
      type: Number,
      required: true,
    },

    previousBalance: {
      type: Number,
      required: true,
    },

    newBalance: {
      type: Number,
      required: true,
    },

    couponsReleased: {
      type: Number,
      default: 0,
    },

    status: {
      type: Number,
      default: 1,
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
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("purchasewallethistories", purchaseWalletHistorySchema);