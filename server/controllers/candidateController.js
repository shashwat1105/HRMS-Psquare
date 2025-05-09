import uploadToCloudinary from '../config/cloudinary.js';
import Candidate from '../models/Candidate.js';
import fs from 'fs';

export const createCandidate = async (req, res) => {

    try{
// const { userId } = req.user;
// console.log("userId",userId);
const { name, email, phone, position, experience } = req.body;
if (!name || !email || !phone || !position || !experience) {
  return res.status(400).json({ message: "Please provide all required fields" });
}

let resume='';
if(req?.files?.resume?.[0]){
    const path=req.files.resume[0].path;
  resume=await uploadToCloudinary(path,'candidate');

     fs.unlinkSync(path);
}

const newCandidate = await Candidate.create({
    name,
    email,
    phone,
    position,
    experience,
    resume,
    // createdBy: userId,
})
  
await newCandidate.save();

return res.status(201).json({ message: "Candidate created successfully", candidate: newCandidate });

    }catch(err){
        console.log("Server error occured!",err);
        return res.status(500).json({message:"Srever error occured",err})
    }

};

export const getAllCandidates = async (req, res) => {

  try{

    const allusers = await Candidate.find({});
       
  if (!allusers) {
    return res.status(400).json({ message: 'No candidates found!',});
  }
  
  res.status(200).json({message: 'All candidates fetched successfully', count: allusers.length, data: allusers});
  }catch(err){
    console.log("Server error occured!",err);
    return res.status(500).json({message:"Srever error occured",err})
  }


};

// In your candidate controller
export const updateCandidateStatus = async (req, res) => {
    try {
      // Verify authentication first
     
  
      const { id } = req.params;
      const { status } = req.body;
  
      const candidate = await Candidate.findOneAndUpdate(
        { _id: id },
        { status },
        { new: true }
      );
  
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      res.status(200).json({ 
        success: true,
        message: 'Status updated',
        data: candidate
      });
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
 

export const deleteCandidate = async (req, res) => {
  const { id } = req.params;
  
  const candidate = await Candidate.findByIdAndDelete(id);
  
  if (!candidate) {
    return res.status(404).json({
      success: false,
      message: `No candidate found with id ${id}`,
    });
  }
  
  res.status(200).json({message: 'Candidate deleted successfully', data: {},});
};