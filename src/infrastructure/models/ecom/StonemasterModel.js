import mongoose from "mongoose";

const stoneMasterSchema = new mongoose.Schema(
  {
    stonename: {
      type: String,
      required: true,
    },
    percraterate: {
      type: String,
      required: true,
    },
    stone_cut_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cut_master",
      required: false,
    },
    clarity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clarity_master",
      required: false,
    },
    color_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "color_master",
      required: false,
    },
    shape_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shape_master",
      required: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    charge: {
      type: Number,
      required: false,
      default: 0,
    },
    is_diamond: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("stone_master", stoneMasterSchema);
