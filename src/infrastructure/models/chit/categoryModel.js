import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    id_branch: {
      type: mongoose.Schema.Types.ObjectId,
      // required:true,
      ref: "Branch",
    },
    id_metal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metal",
      required: true,
    },
    category_name: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: true,
    },
    categoryBanner: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Category", categorySchema);
