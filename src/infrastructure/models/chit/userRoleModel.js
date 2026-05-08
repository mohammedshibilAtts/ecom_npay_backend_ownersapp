import mongoose from "mongoose";

const userroleSchema = new mongoose.Schema(
  {
    id_role: {
      type: Number,
      unique: true
    },
    role_name: {
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
  { timestamps: true }
);

export default mongoose.model("UserRole", userroleSchema);
