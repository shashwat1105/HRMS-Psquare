import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    maxlength: [20, 'Phone number cannot be longer than 20 characters'],
  },
  position: {
    type: String,
    required: [true, 'Please provide position'],
    trim: true,
    maxlength: [50, 'Position cannot be more than 50 characters'],
  },
  status: {
    type: String,
    enum: ['new', 'scheduled', 'ongoing', 'selected', 'rejected'],
    default: 'new',
  },
  experience: {
    type: String,
    required: [true, 'Please provide experience'],
    trim: true,
  },
  resume: {
    type: String,
    required: [true, 'Please upload resume'],
  },
  interviewDate: {
    type: Date,
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [500, 'Feedback cannot be more than 500 characters'],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Candidate', CandidateSchema);