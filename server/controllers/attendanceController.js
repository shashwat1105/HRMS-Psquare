import Attendance from '../models/Attendance.js';

export const getAllAttendance = async (req, res) => {
    try {
      const attendance = await Attendance.find({})
        .populate({
          path: 'employee',
          select: 'name email phone position photo department' 
        });
        
      res.status(200).json({
        message: 'All attendance records fetched successfully',
        success: true,
        count: attendance.length,
        data: attendance,
      });
    } catch(err) {
      console.log("Server error occurred!", err);
      return res.status(500).json({ message: "Server error occurred", err });
    }
  };

export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const {status}=req.body;
  
  const attendance = await Attendance.findByIdAndUpdate( id,{status:status},
    { new: true, runValidators: true });
  
  if (!attendance) {
    return res.status(400).json({
      success: false,
      message: `No attendance record found with id ${id}`,
    });
  }
  
  res.status(200).json({
    message: 'Attendance record updated successfully',success: true, data: attendance,
  });
};

 