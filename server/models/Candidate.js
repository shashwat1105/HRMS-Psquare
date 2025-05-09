import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,required: true,trim: true,
  },
  email: {
    type: String,required:true,unique: true,trim: true,
  },
  phone: {
 type: String,required: true,maxlength: 10,
  },
  position: {
    type: String,required: true,trim: true,
  },
  status: {
    type: String,enum: ['new', 'scheduled', 'ongoing', 'selected', 'rejected'],default: 'new',
  },
  experience: {
    type: String,required: true,trim: true,
  },
  resume: {
    type: String,required: true,
  },
  interviewDate: {
    type: Date,
  },
  feedback: {
    type: String,trim: true,
  },
 
 
},{ timestamps: true });

export default mongoose.model('Candidate', CandidateSchema);