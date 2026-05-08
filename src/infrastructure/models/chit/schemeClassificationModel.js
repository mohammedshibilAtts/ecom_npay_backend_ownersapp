import mongoose from 'mongoose'

const schemeClassifictionSchema= new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      order:{
        type:Number
      },
      active: {
        type: Boolean,
        default:true
      },
      created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Employee'
      },
      is_deleted:{
        type:Boolean,
        default:false
      },
      payment_editable:{
        type:Boolean,
        default:false
      },
      classifcationImg:{
        type:String,
        default:""
      }
    },
    {
      timestamps: true
});

export default mongoose.model('SchemeClassification',schemeClassifictionSchema);