import mongoose from 'mongoose';

const installmenttypeSchema = new mongoose.Schema({
    installment_type: {
        type: Number,
        default: 0
    },
    installment_name: { 
      type: String, 
      default: null 
    },
    active: {
        type: Number,
        default: 1 //1-active, 0-inactive
    },
    sortOrder: { 
        type: Number
      },
}, {
    timestamps: true
});

export default mongoose.model('InstallmentType', installmenttypeSchema);