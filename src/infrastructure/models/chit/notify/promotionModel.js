import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    isHtml: { type: Boolean, default: false },
    noti_image: String,
    pushNotification: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
    campaignTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampaignType",
    },
    branchId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
    schemeId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scheme" }],
    schemeBased: { type: Boolean, default: false },
    selectAll: { type: Boolean, default: false },
    scheduledAt: Date,
    sentAt: Date,
    is_auto: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "scheduled", "sent", "failed"],
      default: "pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    pushCount: { type: Number, default: 0 },
    pushFailCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Promotion", PromotionSchema);
