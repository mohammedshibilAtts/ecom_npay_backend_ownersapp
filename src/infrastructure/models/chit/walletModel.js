import mongoose, { Schema } from 'mongoose';

const walletSchema = new mongoose.Schema({
    id_customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    id_employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    id_scheme_account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SchemeAccount",
    },
    mobile:{
        type:String
    },
    bill_no: {
        type: String,
        default: 0
    },

    total_reward_amt: {
        type: Number,
        required: true,
        default: 0
    },
    redeem_amt: {
        type: Number,
        required: true,
        default: 0
    },
    balance_amt: {
        type: Number,
        required: true,
        default: 0
    },
    payment_mode: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    create_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
    modified_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    modified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    }
}, {
    timestamps: true
});

walletSchema.index(
  { mobile: 1, is_deleted: 1 },
  { unique: true }
);


export default mongoose.model('Wallet', walletSchema);