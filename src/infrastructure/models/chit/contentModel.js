import mongoose from 'mongoose';


const ContentManagementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    content: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "StaffUser",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffUser",
      default: null,
    },
    toAdmin: { // show to admin only
      type: Boolean,
      default: false
    },
    toCustomer: {  // show to customers only
      type: Boolean,
      default: true
    },
    webVisible: {  // show in the ecom web
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


export default mongoose.model('ContentManagement', ContentManagementSchema);