import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import {
  createCandidate,
  getAllCandidates,
  updateCandidateStatus,
  downloadResume,
  deleteCandidate,
} from '../controllers/candidateController.js';
import upload from '../utils/multer.js';

const router = express.Router();

router
  .route('/')
  .post(
    authenticateUser,
    authorizeRoles('hr'),
    upload.single('resume'),
    createCandidate
  )
  .get(authenticateUser, authorizeRoles('hr'), getAllCandidates);

router
  .route('/:id/status')
  .patch(authenticateUser, authorizeRoles('hr'), updateCandidateStatus);

router
  .route('/:id/resume')
  .get(authenticateUser, authorizeRoles('hr'), downloadResume);

router
  .route('/:id')
  .delete(authenticateUser, authorizeRoles('hr'), deleteCandidate);

export default router;