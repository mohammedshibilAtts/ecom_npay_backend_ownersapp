// models/itemModel.js

import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    size: {
      type: String,
      ref: "SizeMaster",
    },

    id_purity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purity",
      required: true,
    },
    currentMetalRate: {
      type: Number,
      required: true,
    },

    tagNo: {
      type: String,
      required: true,
      unique: true,
    },
    sizeValue: {
      type: String,
      required: true,
      index: true,
    },
    // unit: {
    //   type: String,
    //   required: true,
    // },

    grossWt: {
      type: Number,
      required: true,
    },
    netWeight: {
      type: Number,
      required: true,
    },

    stonewt: Number,
    diamondcts: Number,
    diamondwt: Number,

    diaCertificateNo: String,

    huidCharges: Number,
    huidNo: String,
    showHuidNo: Boolean,
    showHuidCharge: Boolean,

    gst: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true, // created date price
    },
    totalprice: {
      type: Number,
      required: true, //  created date Total Price
    },

    makingCharges: {
      makingMode: Number,
      calculationType: Number,
      makingActualValue: Number,
      makingDiscountedPercentage: Number,
      makingDiscountedValue: Number,
    },

    wastageCharges: {
      wastageMode: Number,
      calculationType: Number,
      wastageActualValue: Number,
      wastageDiscountedPercentage: Number,
      wastageDiscountedValue: Number,
    },

    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Number,
      default: 1
    },
    stoneDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: "StoneDetails" }],
    id_color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
    },
    id_certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
    }
  },
  { timestamps: true },
);

// Compound indexes for product pipeline lookups — eliminates full collection scans
itemSchema.index({ productId: 1, active: 1, is_deleted: 1 });
itemSchema.index({ productId: 1, active: 1, status: 1, is_deleted: 1 });
itemSchema.index({ productId: 1, id_purity: 1, active: 1, is_deleted: 1 });

export default mongoose.model("Item", itemSchema);
