import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import { StatusCodes } from 'http-status-codes';

export const createAttendance = async (req, res) => {
  const { employee, date, status, checkIn, checkOut, tasks, notes } = req.body;
  
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
  
  const existingAttendance = await Attendance.findOne({
    employee,
    date: new Date(date),
  });
  
  if (existingAttendance) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Attendance already recorded for this date',
    });
  }
  
  const attendance = await Attendance.create({
    employee,
    date,
    status,
    checkIn,
    checkOut,
    tasks,
    notes,
    createdBy: req.user.userId,
  });
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: attendance,
  });
};

export const getAllAttendance = async (req, res) => {
  const { employee, date, status, month, year } = req.query;
  
  const queryObject = { createdBy: req.user.userId };
  
  if (employee && employee !== 'all') {
    queryObject.employee = employee;
  }
  
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  
  if (date) {
    queryObject.date = new Date(date);
  }
  
  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    queryObject.date = { $gte: startDate, $lte: endDate };
  }
  
  const attendance = await Attendance.find(queryObject)
    .populate({
      path: 'employee',
      select: 'name email phone position photo',
    })
    .sort('-date');
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: attendance.length,
    data: attendance,
  });
};

export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  
  const attendance = await Attendance.findOneAndUpdate(
    { _id: id, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  ).populate({
    path: 'employee',
    select: 'name email phone position photo',
  });
  
  if (!attendance) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No attendance record found with id ${id}`,
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: attendance,
  });
};

export const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  
  const attendance = await Attendance.findOneAndDelete({
    _id: id,
    createdBy: req.user.userId,
  });
  
  if (!attendance) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No attendance record found with id ${id}`,
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: {},
  });
};