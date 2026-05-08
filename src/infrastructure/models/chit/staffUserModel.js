import mongoose from 'mongoose';

const staffuserSchema = new mongoose.Schema(
  {
    id_employee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Employee',
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    id_role: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"UserRole",
    },
    access_branch: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true
    },
    is_deleted:{
      type:Boolean,
      default:false
    },
    id_branch: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Branch',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('StaffUser', staffuserSchema);