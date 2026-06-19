import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: Number,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Color = mongoose.model("Color", colorSchema);

export default Color;
