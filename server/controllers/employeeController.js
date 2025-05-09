import Employee from '../models/Employee.js';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs';

export const createEmployee = async (req, res) => {
  req.body.createdBy = req.user.userId;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'hrms/employees',
    });
    req.body.photo = result.secure_url;
    fs.unlinkSync(req.file.path);
  }

  const employee = await Employee.create(req.body);
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: employee,
  });
};

export const getAllEmployees = async (req, res) => {
  const { department, position, status, search } = req.query;
  
  const queryObject = { createdBy: req.user.userId };
  
  if (department && department !== 'all') {
    queryObject.department = department;
  }
  
  if (position && position !== 'all') {
    queryObject.position = position;
  }
  
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  
  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }
  
  const employees = await Employee.find(queryObject).sort('-createdAt');
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: employees.length,
    data: employees,
  });
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, {
      folder: 'hrms/employees',
    });
    req.body.photo = result.secure_url;
    fs.unlinkSync(req.file.path);
  }
  
  const employee = await Employee.findOneAndUpdate(
    { _id: id, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!employee) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No employee found with id ${id}`,
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: employee,
  });
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  
  const employee = await Employee.findOneAndDelete({
    _id: id,
    createdBy: req.user.userId,
  });
  
  if (!employee) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No employee found with id ${id}`,
    });
  }
  
  if (employee.photo !== 'default.jpg') {
    const publicId = employee.photo.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`hrms/employees/${publicId}`);
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: {},
  });
};