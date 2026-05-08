import mongoose from 'mongoose';

const relationshipSchema = new mongoose.Schema(
  {
    id_relationship: {
      type: Number,
      default: 1,
    },
    relationship: {
      type: String,
    },
    active: {
      type: Boolean,
      default:true, 
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('Relationship', relationshipSchema);