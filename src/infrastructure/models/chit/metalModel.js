import mongoose from "mongoose";

const metalSchema = new mongoose.Schema(
  {
    id_metal:{
      type:Number
    },
    id_metal: {
      type: Number,
      required: true,
      default: 1,
    },
    metal_name: {
      type: String,
      required: true,
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
  {
    timestamps: true,
  }
);

const Metal = mongoose.model("Metal", metalSchema);

export default Metal;