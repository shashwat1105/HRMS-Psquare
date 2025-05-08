import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: [true, 'Please provide employee'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date'],
  },
  reason: {
    type: String,
    required: [true, 'Please provide reason'],
    trim: true,
    maxlength: [500, 'Reason cannot be more than 500 characters'],
  },
  type: {
    type: String,
    enum: ['sick', 'casual', 'annual', 'maternity', 'paternity', 'unpaid'],
    default: 'casual',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  docs: [
    {
      url: String,
      publicId: String,
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

LeaveSchema.pre('save', async function (next) {
  if (this.status !== 'approved') return next();
  
  const overlappingLeave = await this.constructor.findOne({
    employee: this.employee,
    status: 'approved',
    $or: [
      {
        startDate: { $lte: this.endDate },
        endDate: { $gte: this.startDate },
      },
    ],
    _id: { $ne: this._id },
  });
  
  if (overlappingLeave) {
    throw new Error('Employee already has an approved leave during this period');
  }
  
  next();
});

export default mongoose.model('Leave', LeaveSchema);