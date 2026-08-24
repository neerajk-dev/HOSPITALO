import express from 'express';
import authUser from '../middlewares/authUser.js';
import authDoctor from '../middlewares/authDoctor.js';
import authAdmin from '../middlewares/authAdmin.js';
import { createDiagnosis, getPatientDiagnosisHistory, getAllDiagnosisRecords, updateDiagnosisReview } from '../controllers/aiController.js';

const aiRouter = express.Router();

// Patient routes
aiRouter.post('/predict', authUser, createDiagnosis);
aiRouter.get('/history', authUser, getPatientDiagnosisHistory);

// Doctor and admin review routes
aiRouter.get('/doctor-review', authDoctor, getAllDiagnosisRecords);
aiRouter.post('/review', authDoctor, updateDiagnosisReview);
aiRouter.get('/admin-history', authAdmin, getAllDiagnosisRecords);

export default aiRouter;
