import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,ref: 'Employee', required: true,
  },
  date: {
    type: Date,required: true,default: Date.now,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Medical Leave", "Work From Home"],
    default: 'Present',
  },
 
  tasks: [
     { description: {

         type: String,required: true,trim: true,maxlength: 500
     }
      }
  ],
 
},{ timestamps: true });

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', AttendanceSchema);