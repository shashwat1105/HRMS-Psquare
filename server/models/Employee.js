import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: {
type: String, required: true, trim: true,
  },
  email: {
    type: String,required: true,unique: true,trim: true,
  },
  phone: {
    type: String,required: true,maxlength: 10
  },
  position: {
    type: String,required: true,  trim: true,
    enum:["Intern","Full Time","Senior","Junior","Team Lead"],
    default: "Intern"
  },
  department: {
    type: String,required: true,trim: true,
    enum: ['Designer', 'Backend Development', 'Human Resource', 'Frontend Development', 'Marketing'],
    default: 'Designer',
},
  dateOfJoining: {
    type: Date,required: true,
  },
  photo: {
    type: String,required: true,
  },
 
 
},{ timestamps: true });

export default mongoose.model('Employee', EmployeeSchema);