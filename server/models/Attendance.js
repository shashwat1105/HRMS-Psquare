import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: [true, 'Please provide employee'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide date'],
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half_day'],
    default: 'present',
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  tasks: [
    {
      description: {
        type: String,
        required: [true, 'Please provide task description'],
        trim: true,
        maxlength: [500, 'Task description cannot be more than 500 characters'],
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
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

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', AttendanceSchema);