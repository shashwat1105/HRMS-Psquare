import uploadToCloudinary from '../config/cloudinary.js';
import Employee from '../models/Employee.js';
import fs from 'fs';

export const createEmployee = async (req, res) => {
  
    try{

        const {name,email,phone,position,department,joiningDate}=req.body;
        if(!name || !email || !phone || !position || !department || !joiningDate){
            return res.status(400).json({message:"Please provide all required fields"});
        }
        let photo='';
        if(req?.files?.photo?.[0]){
            const path=req.files.photo[0].path;
          photo=await uploadToCloudinary(path,'candidate');
        
             fs.unlinkSync(path);
        }
        const newEmployee = await Employee.create({
            name,
            email,
            phone,
            position,
            department,
            joiningDate,
            photo,
        });
        await newEmployee.save();
        return res.status(201).json({message:"Employee created successfully",employee:newEmployee});
    }catch(err){
        console.log("Server error occured!",err);
        return res.status(500).json({message:"Srever error occured",err})
    }
};

export const getAllEmployees = async (req, res) => {
  try{

    const allEmployees = await Employee.find({});
    
    if (!allEmployees) {
      return res.status(400).json({ message: 'No employees found!' });
    }
    
    res.status(200).json({
      message: 'All employees fetched successfully',
      count: allEmployees.length,
      data: allEmployees,
    });
  }catch(err){
    console.log("Server error occured!",err);
    return res.status(500).json({message:"Srever error occured",err})
  }
  
};


export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = {}; // Object to store only updated fields

    const allowedFields = ["name", "email", "phone", "position", "department", "joiningDate"];
    
    // Add only defined fields to updateFields
    for (const field of allowedFields) {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        updateFields[field] = req.body[field];
      }
    }

    let photo=''
    // Handle resume upload
    if (req?.files?.photo?.[0]) {
      const path = req.files.photo[0].path;
      photo = await uploadToCloudinary(path, 'candidate');
      fs.unlinkSync(path);
      updateFields.photo = photo;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee updated successfully", data: updatedEmployee });
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  
  const employee = await Employee.findByIdAndDelete(id);
  
  if (!employee) {
    return res.status(400).json({
      success: false,
      message: `No employee found with id ${id}`,
    });
  }
 
  
  res.status(200).json({message: 'Employee deleted successfully', data: {}});
};