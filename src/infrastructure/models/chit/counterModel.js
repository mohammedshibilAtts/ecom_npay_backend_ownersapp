import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    sequence_value: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Counter || mongoose.model("Counter", counterSchema);
