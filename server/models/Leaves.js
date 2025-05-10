import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,ref: 'Employee',required: true,
  },
  date:{
    type: Date,required: true,
  },
  reason: {
    type: String,required: true,trim: true,maxlength: 500,
  },
 
  status: {
    type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending',
  },
  docs: {
   type: String,required: true,trim: true,
    },
  
  
},{timestamps: true});

 
export default mongoose.model('Leave', LeaveSchema);