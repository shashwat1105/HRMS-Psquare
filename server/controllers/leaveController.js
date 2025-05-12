import Leave from '../models/Leaves.js';
import Employee from '../models/Employee.js';
// import { cloudinary } from '../config/cloudinary.js';
import fs from 'fs';
import uploadToCloudinary from '../config/cloudinary.js';

export const createLeave = async (req, res) => {
    const { employee, designation, leaveDate, reason } = req.body;
  
    if (!employee || !designation || !leaveDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }
  
    if (!req?.files?.docs?.[0]) {
      return res.status(400).json({
        success: false,
        message: 'Supporting document is required',
      });
    }
  
    try {
      const path = req.files.docs[0].path;
      const docs = await uploadToCloudinary(path, 'leave');
      fs.unlinkSync(path); 
  
      if (!docs) {
        throw new Error('Failed to upload document to Cloudinary');
      }
  
      const leave = await Leave.create({
        employee,
        designation,
        date: leaveDate,
        reason,
        docs, 
      });
  
      res.status(201).json({
        message: 'Leave created successfully',
        success: true,
        data: leave,
      });
    } catch (error) {
      console.error('Error creating leave:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create leave',
        error: error.message
      });
    }
  };

export const getAllLeaves = async (req, res) => {
    
try{
    
const leaves=await Leave.find({}).populate({
    path: 'employee',
    select: 'name photo'
})

if(!leaves){
    return res.status(400).json({message:'No leaves found!'});
}
return res.status(200).json({
    message: 'All leaves fetched successfully',
    success: true,
    count: leaves.length,
    data: leaves,
});

}catch(err){
    console.log("Server error occured!",err);
    return res.status(500).json({message:"Srever error occured",err})
}
};



export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status} = req.body;
  
    if (!status) {
        return res.status(400).json({
        success: false,
        message: 'Please provide status',
        });
    }

    const leaveUpdate = await Leave.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if(!leaveUpdate) {
        return res.status(404).json({
            success: false,
            message: `No leave found with id ${id}`,
        });
    }

    res.status(200).json({
        success: true,
        message: 'Leave status updated successfully',
        data: leaveUpdate,
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

 