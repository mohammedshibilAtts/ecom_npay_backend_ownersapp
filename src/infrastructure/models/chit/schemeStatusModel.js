import mongoose from 'mongoose';
  

const schemestatusSchema = new mongoose.Schema({
    id_status: {
        type: Number,
        default: 1
    },
    status_name: { 
      type: String, 
      default: null 
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:true
    }
    
}, {
    timestamps: true
});

export default mongoose.model('SchemeStatus', schemestatusSchema);