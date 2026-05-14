import mongoose from "mongoose";

const closeaccbillSchema = new mongoose.Schema(
  {
    id_scheme_account: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SchemeAccount",
    },
    // refund_paymenttype: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "PaymentMode",
    //   default:null
    // },
    otpVerified:{
      type:Boolean,
      default:false
    },
    comments: {
      type: String,
    },
    bill_no: {
      type: String,
      required: true,
    },
    bill_date: {
      type: Date,
      required: true,
    },
    id_branch: {
      type: mongoose.Schema.Types.ObjectId,
      requried: true,
      ref: "Branch",
    },
    return_amount: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    previousStatus: {
      type: Number
    },
    closed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    active:{
      type:Number,
      default:1
    },
    card_amount:{
      type:Number,
      default:0
    },
    cash_amount:{
      type:Number,
      default:0
    },
    debitcard_amount:{
      type:Number,
      default:0
    },
    gpay_amount:{
      type:Number,
      default:0
    },
    phonepay_amount:{
      type:Number,
      default:0
    },
    chitRedeemed:{
      type:Boolean,
      default:false
    },
    chitRedeemedBy:{
      type:String,
      default:""
    },
    precloseType:{
      type:Number,
      default:null
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CloseAccBill", closeaccbillSchema);