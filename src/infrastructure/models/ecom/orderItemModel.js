import mongoose, { Schema, Types } from "mongoose";

const chargeSchema = new mongoose.Schema({
  mode: {
    type: Number, // 1- amount , 2- amount
    required: false,
  },
  actualValue: {
    type: Number,
    required: false,
  },
  discountedValue: {
    type: Number,
    default: null,
  },
  discountedPercentage: {
    type: Number,
    default: null,
  },
  discountView: {
    type: Boolean,
    required: false,
  },
  mcView: {
    type: Boolean,
  },
  wastageView: {
    type: Boolean,
  },
});

const OrderItemSchema = new Schema(
  {
    orderId: {
      type: Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    // Product linkage
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    itemId: { type: Types.ObjectId, ref: "Item", required: false },
    sizeId: { type: String, required: false },
    categoryId: { type: Types.ObjectId, ref: "Category" },
    subCategoryId: { type: Types.ObjectId, ref: "SubCategory" },
    productName: { type: String, required: true },
    sku: { type: String },
    image: { type: String },

    grossWeight: { type: Number, required: true },
    netWt: { type: Number, required: true },
    metalRate: { type: Number, required: true },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    quantity: { type: Number, min: 1, required: true, default: 1 },
    discountAmount: { type: Number, default: 0 },
    totalStoneWeight: { type: Number, default: 0 },
    totalDiamondWeight: { type: Number, default: 0 },
    totalStonePrice: { type: Number, default: 0 },
    totalDiamondPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
      index: true,
    },
    trackingNumber: { type: String, index: true },
    shippedAt: Date,
    deliveredAt: Date,

    // Returns
    returnStatus: {
      type: String,
      enum: [
        "none",
        "requested",
        "approved",
        "rejected",
        "refunded",
        "replaced",
      ],
      default: "none",
    },
    refundAmount: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    estimatedDeliveryDays: { type: Number, required: true, default: 0 },
    estimatedDeliveryDate: { type: Date },
    makingCharges: {
      type: chargeSchema,
      default:null,
      required: false,
    },
    wastageCharges: {
      type: chargeSchema,
      default:null,
      required: false,
    },
    id_purity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purity",
      required: true,
    },
    id_metal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metal",
      required: true,
    },
    purityName: { type: String },
    huidNo: { type: String },
    huidCharges: { type: Number, default: 0 },
    diaCertificateNo: { type: String },
    size: { type: String },
  },

  { timestamps: true }
);

// Indexes for fast lookups
OrderItemSchema.index({ productId: 1 });
OrderItemSchema.index({ categoryId: 1, subCategoryId: 1 });

OrderItemSchema.pre("save", function (next) {
  if (this.isModified("estimatedDeliveryDays") || this.isNew) {
    const today = new Date();
    this.estimatedDeliveryDate = new Date(
      today.setDate(today.getDate() + this.estimatedDeliveryDays)
    );
  }
  next();
});

export const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
