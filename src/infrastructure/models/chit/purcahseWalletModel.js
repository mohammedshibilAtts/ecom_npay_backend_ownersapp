import mongoose from "mongoose";

const purchaseWalletSchema = new mongoose.Schema(
  {
    idCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    totalWeightSaved: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    couponReleasedCount: {
      type: Number,
      default: 0,
    },
    pendingReleaseWeight: {
      type: Number,
      default: 0,
    },
    lastReleasedAt: {
      type: Date,
      default: null,
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

purchaseWalletSchema.methods.addWeight = function (weight) {
  this.totalWeightSaved += weight;
  this.currentBalance += weight;

  let total = this.currentBalance + this.pendingReleaseWeight;

  const couponWeight = 2; 
  const couponsToRelease = Math.floor(total / couponWeight);

  if (couponsToRelease > 0) {
    this.couponReleasedCount += couponsToRelease;
    this.lastReleasedAt = new Date();
  }

  this.pendingReleaseWeight = total % couponWeight;

  this.currentBalance = this.pendingReleaseWeight;
};

export default mongoose.model("purchasewallets", purchaseWalletSchema);
