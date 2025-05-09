import express from 'express';
// import { authenticateUser } from '../middleware/auth.js';
import {
  createCandidate,
  getAllCandidates,
  updateCandidateStatus,
  deleteCandidate,
} from '../controllers/candidateController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/getAll', getAllCandidates);

router.post('/add',upload.fields([{name:'resume',maxCount:1}]),createCandidate);

router.patch('/update/:id', updateCandidateStatus);

router.delete('/:id', deleteCandidate);

export default router;