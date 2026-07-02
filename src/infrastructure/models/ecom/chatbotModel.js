import mongoose from "mongoose";

const ChatbotItemSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      enum: [1, 2], // 1 = Question, 2 = Answer
      required: true,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
    options: [
      {
        label: { type: String, required: true },
        nextId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatbotItem" },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("ChatbotItem", ChatbotItemSchema);
