import mongoose from 'mongoose';

const TopupSchema = new mongoose.Schema({
    id_branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch"
    },
    SMS: {type:Number,default:0},
    WhatsApp: { type: Number, default: 0 },
    Email: { type: Number, default: 0 },
    status: { type: Number, enum: [0, 1], default: 1 }, // 0 - Requested, 1 - Approved
    active: { type: Boolean, default: true }, 
    remarks: { type: String,default:""}
}, { timestamps: true });

export default mongoose.model("topup", TopupSchema);
