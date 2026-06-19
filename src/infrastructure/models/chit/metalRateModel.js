import mongoose from "mongoose";
const { Schema } = mongoose;

const metalRatesSchema = new Schema(
  {
    id_branch: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Branch",
    },

    purity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purity",
      required: true,
    },
    material_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metal",
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    modified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);
// Compound indexes for latest-rate lookups in pricing pipeline
metalRatesSchema.index({ purity_id: 1, createdAt: -1 });
metalRatesSchema.index({ material_type_id: 1, id_branch: 1, createdAt: -1 });

export default mongoose.model("MetalRate", metalRatesSchema);
