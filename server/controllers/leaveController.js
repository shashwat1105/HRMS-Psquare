import Leave from '../models/Leaves.js';
import Employee from '../models/Employee.js';
import { StatusCodes } from 'http-status-codes';
import { cloudinary } from '../config/cloudinary.js';
import fs from 'fs';

export const createLeave = async (req, res) => {
  const { employee, startDate, endDate, reason, type } = req.body;
  
  const emp = await Employee.findOne({
    _id: employee,
    status: 'active',
    createdBy: req.user.userId,
  });
  
  if (!emp) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Employee not found or not active',
    });
  }
  
  const docs = [];
  if (req.files && req.files.docs) {
    for (const file of req.files.docs) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: 'hrms/leaves',
      });
      docs.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
      fs.unlinkSync(file.path);
    }
  }
  
  const leave = await Leave.create({
    employee,
    startDate,
    endDate,
    reason,
    type,
    docs,
    createdBy: req.user.userId,
  });
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: leave,
  });
};

export const getAllLeaves = async (req, res) => {
  const { employee, status, type, month, year } = req.query;
  
  const queryObject = { createdBy: req.user.userId };
  
  if (employee && employee !== 'all') {
    queryObject.employee = employee;
  }
  
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  
  if (type && type !== 'all') {
    queryObject.type = type;
  }
  
  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    queryObject.startDate = { $lte: endDate };
    queryObject.endDate = { $gte: startDate };
  }
  
  const leaves = await Leave.find(queryObject)
    .populate({
      path: 'employee',
      select: 'name email phone position photo',
    })
    .sort('-createdAt');
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: leaves.length,
    data: leaves,
  });
};

export const getCalendarLeaves = async (req, res) => {
  const { month, year } = req.query;
  
  if (!month || !year) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please provide month and year',
    });
  }
  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  const leaves = await Leave.find({
    createdBy: req.user.userId,
    status: 'approved',
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  })
    .populate({
      path: 'employee',
      select: 'name photo',
    })
    .sort('startDate');
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: leaves.length,
    data: leaves,
  });
};

export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  
  const leave = await Leave.findOneAndUpdate(
    { _id: id, createdBy: req.user.userId },
    { status, notes },
    { new: true, runValidators: true }
  ).populate({
    path: 'employee',
    select: 'name email phone position photo',
  });
  
  if (!leave) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No leave found with id ${id}`,
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: leave,
  });
};

export const downloadLeaveDoc = async (req, res) => {
  const { id, docId } = req.params;
  
  const leave = await Leave.findOne({
    _id: id,
    createdBy: req.user.userId,
  });
  
  if (!leave) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No leave found with id ${id}`,
    });
  }
  
  const doc = leave.docs.id(docId);
  if (!doc) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No document found with id ${docId}`,
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      docUrl: doc.url,
    },
  });
};

export const deleteLeave = async (req, res) => {
  const { id } = req.params;
  
  const leave = await Leave.findOneAndDelete({
    _id: id,
    createdBy: req.user.userId,
  });
  
  if (!leave) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No leave found with id ${id}`,
    });
  }
  
  if (leave.docs && leave.docs.length > 0) {
    for (const doc of leave.docs) {
      await cloudinary.uploader.destroy(doc.publicId);
    }
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: {},
  });
};