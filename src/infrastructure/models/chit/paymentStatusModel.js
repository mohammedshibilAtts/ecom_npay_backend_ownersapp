import mongoose from 'mongoose';

const paymentstatusSchema = new mongoose.Schema(
  {
    id_status: {
      type: Number,
      required: true,
      default: 1,
    },
    payment_status: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('PaymentStatus', paymentstatusSchema);