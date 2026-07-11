import mongoose from "mongoose";
const offerSchema = new mongoose.Schema(
  {
    id_branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    title: {
      type: String,
      // required: true,
    },
    videoId: {
      type: String,
      // required: true
    },
    description: {
      type: String,
      // required: true
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    offer_image: {
      type: [String],
      // required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Offers', 'Banner', 'Popup', "Marqueee", "Video"],
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    categoryId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }],
    subcategoryId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    }],
    productIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    categoryOffer: {
      type: Boolean,
      default: false,
    },
    subcategoryOffer: {
      type: Boolean,
      default: false,
    },
    productOffer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Offer", offerSchema);
