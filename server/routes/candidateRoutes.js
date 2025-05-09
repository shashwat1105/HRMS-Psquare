import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import {
  createCandidate,
  getAllCandidates,
  updateCandidateStatus,
  downloadResume,
  deleteCandidate,
} from '../controllers/candidateController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/getAll',authenticateUser, authorizeRoles('hr'), getAllCandidates);

router.post('/add',authenticateUser,authorizeRoles('hr'),upload.fields([{name:'resume',maxCount:1}]),createCandidate);

router.patch('/update/:id',authenticateUser, authorizeRoles('hr'), updateCandidateStatus);

router.delete('/:id',authenticateUser, authorizeRoles('hr'), deleteCandidate);

export default router;