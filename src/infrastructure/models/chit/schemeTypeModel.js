import mongoose from 'mongoose';

const schemeTypeSchema = new mongoose.Schema({
    scheme_type: { 
        type: Number,
        unique: true
    },
    scheme_typename: { 
        type: String, 
        default: null 
    },
    active: { 
        type: Boolean, 
        default:true
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
}, { 
    timestamps: true 
});

const SchemeType = mongoose.model('SchemeType', schemeTypeSchema);
export default SchemeType;