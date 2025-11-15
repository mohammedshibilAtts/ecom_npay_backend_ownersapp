import mongoose, { Schema, Types } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "Customer", index: true },
    phone: String,
    orderId: { type: String, required: true },
    cartId: { type: Types.ObjectId, ref: "Cart" },

    deliveryAddress: { type: Types.ObjectId, ref: "Deliveryaddress" },
    shipping_is_billing: { type: Boolean, default: true },

    // Totals
    itemsCount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    savedAmount: { type: Number, default: 0 },
    // grandTotal: { type: Number, required: true },

    couponCode: { type: String, index: true },

    payment: { type: Types.ObjectId, ref: "Payment" },

    status: {
      type: String,
      enum: [
        "created",
        "Payment Pending",
        "paid",
        "Processing",
        "Placed",
        "part_fulfilled",
        "delivered",
        "Cancelled",
        "returned",
        "closed",
      ],
      default: "created",
      index: true,
    }, // !
    active: { type: Boolean, default: false },
    estimatedDeliveryDays: { type: Number, default: 0 },
    estimatedDeliveryDate: { type: Date },
    deliveredDate: { type: Date },
    orderType: { type: Number, enum: [1, 2, 3], default: 1 }, // 1) Online order  2) store pickup order 3) offline order
    lastStatusUpdatedDate: { type: Date },
    statusData: [
      {
        name: {
          type: String,
          required: true,
        },
        statusNo: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
          default: Date.now,
        },
        remarks: {
          type: String,
          required: true,
        },
      },
    ],
    orderStatus: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8], default: 4 }, //1 Processing, 2 Placed  , 3 Delivered , 4 Cancelled , 5 payment pending, 6 shipped , 7 Ordered , 8  Ready for Pickup
    trackerId: { type: String},
    parcelService: { type: String},
    cancelReason: { type: String},

  },
  { timestamps: true }
);

// Pre-save hook
OrderSchema.pre("save", function (next) {
  if (this.isModified("estimatedDeliveryDays") || this.isNew) {
    const today = new Date();
    this.estimatedDeliveryDate = new Date(
      today.setDate(today.getDate() + this.estimatedDeliveryDays)
    );
  }
  next();
});

// Useful indexes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

export const Order = mongoose.model("Order", OrderSchema);
