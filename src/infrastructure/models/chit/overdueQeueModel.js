import mongoose from "mongoose";

const overdueQueueSchema = new mongoose.Schema({
  customerId: mongoose.Types.ObjectId,
  mobile: String,
  name: String,
  overdueAccounts: [String],   // array of account numbers
  cronStatus: Number,          // 1 created
  sendStatus: Number,          // 2 pending, 1 sent
  scheduledAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("OverdueQueue", overdueQueueSchema);