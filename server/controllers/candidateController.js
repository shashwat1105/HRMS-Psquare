import Candidate from '../models/Candidate.js';
import { StatusCodes } from 'http-status-codes';
import { cloudinary } from '../config/cloudinary.js';
import fs from 'fs';

export const createCandidate = async (req, res) => {
  req.body.createdBy = req.user.userId;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'hrms/resumes',
    });
    req.body.resume = result.secure_url;
    fs.unlinkSync(req.file.path);
  }

  const candidate = await Candidate.create(req.body);
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: candidate,
  });
};

export const getAllCandidates = async (req, res) => {
  const { status, position, search } = req.query;
  
  const queryObject = { createdBy: req.user.userId };
  
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  
  if (position && position !== 'all') {
    queryObject.position = position;
  }
  
  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }
  
  const candidates = await Candidate.find(queryObject).sort('-createdAt');
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: candidates.length,
    data: candidates,
  });
};

export const updateCandidateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const candidate = await Candidate.findOneAndUpdate(
    { _id: id, createdBy: req.user.userId },
    { status },
    { new: true, runValidators: true }
  );
  
  if (!candidate) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No candidate found with id ${id}`,
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: candidate,
  });
};

export const downloadResume = async (req, res) => {
  const { id } = req.params;
  
  const candidate = await Candidate.findOne({
    _id: id,
    createdBy: req.user.userId,
  });
  
  if (!candidate) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No candidate found with id ${id}`,
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      resumeUrl: candidate.resume,
    },
  });
};

export const deleteCandidate = async (req, res) => {
  const { id } = req.params;
  
  const candidate = await Candidate.findOneAndDelete({
    _id: id,
    createdBy: req.user.userId,
  });
  
  if (!candidate) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No candidate found with id ${id}`,
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: {},
  });
};