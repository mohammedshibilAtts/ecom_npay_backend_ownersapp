import mongoose from "mongoose";
import { Schema } from "mongoose";

// ===== PRODUCT = PURE DESIGN MASTER =====

const productSchema = new mongoose.Schema(
  {
    id_category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },

    id_branch: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Branch",
    },

    product_name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: null,
    },

    // Unique design code
    code: {
      type: String,
      required: true,
      unique: true,
    },

    id_metal: {
      type: Schema.Types.ObjectId,
      ref: "Metal",
      required: true,
    },

    gst: {
      type: Number,
      required: true,
      default: 3,
    },

    product_image: {
      type: [String],
      default: [],
    },

    showprice: {
      type: Boolean,
      default: true,
    },

    isMrp: {
      type: Boolean,
      default: false,
    },

    subcategoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "SubCategory",
    },
    
    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SizeMaster",
      required: true,
    },
    
    sku: {
      type: String,
      default: null,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    // ===== SYSTEM FIELDS =====

    active: {
      type: Boolean,
      default: true,
    },

    onlineProduct: {
      type: Boolean,
      default: true,
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Employee",
    },

    modified_by: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Employee",
    },

    collection: {
      type: [Schema.Types.ObjectId],
      default: [],
      validate: {
        validator: function (array) {
          return array.every((item) => mongoose.Types.ObjectId.isValid(item));
        },
        message: "All items must be valid ObjectIds",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes for product listing and filter queries
productSchema.index({ is_deleted: 1, active: 1 });
productSchema.index({ is_deleted: 1, active: 1, id_category: 1 });
productSchema.index({ is_deleted: 1, active: 1, subcategoryId: 1 });
productSchema.index({ is_deleted: 1, active: 1, id_branch: 1 });
productSchema.index({ is_deleted: 1, active: 1, collection: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ product_name: 1 });
productSchema.index({ sku: 1 });

export default mongoose.model("Product", productSchema);