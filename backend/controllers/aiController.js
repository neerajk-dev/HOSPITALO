import { getDiseaseMatches, getRiskLevel, getRecommendedTests } from '../data/diseaseRules.js';
import AIPrediction from '../models/AIPrediction.js';

// Helper to build a beginner-friendly AI response from the rules file.
const buildPredictionResult = ({ age, gender, symptoms = [] }) => {
  const predictions = getDiseaseMatches(symptoms);
  const topPrediction = predictions[0] || null;

  return {
    predictions: predictions.map((item) => ({
      disease: item.disease,
      match: item.match,
      matchedSymptoms: item.matchedSymptoms
    })),
    risk: getRiskLevel(topPrediction?.match || 0),
    recommendedTests: getRecommendedTests(topPrediction?.disease || null),
    age,
    gender,
    symptoms
  };
};

// Create a fresh diagnosis and save it in MongoDB.
const createDiagnosis = async (req, res) => {
  try {
    const { age, gender, symptoms = [], userId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User authentication is required.' });
    }

    if (!age || !gender || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: 'Age, gender, and symptoms are required.' });
    }

    const result = buildPredictionResult({ age, gender, symptoms });

    const prediction = await AIPrediction.create({
      userId,
      age,
      gender,
      symptoms,
      predictions: result.predictions,
      risk: result.risk,
      recommendedTests: result.recommendedTests
    });

    return res.json({
      success: true,
      message: 'Prediction created successfully.',
      data: {
        prediction,
        result
      }
    });
  } catch (error) {
    console.error('AI diagnosis error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Unable to create AI diagnosis.' });
  }
};

// Return the history of predictions for a patient.
const getPatientDiagnosisHistory = async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User authentication is required.' });
    }

    const history = await AIPrediction.find({ userId }).sort({ createdAt: -1 });

    return res.json({ success: true, data: history });
  } catch (error) {
    console.error('AI history error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Unable to load prediction history.' });
  }
};

// Return all predictions for doctors and admins to review.
const getAllDiagnosisRecords = async (req, res) => {
  try {
    const records = await AIPrediction.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: records });
  } catch (error) {
    console.error('AI list error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Unable to load AI diagnosis records.' });
  }
};

// Update a record with doctor notes and final diagnosis.
const updateDiagnosisReview = async (req, res) => {
  try {
    const { predictionId, doctorFinalDiagnosis, doctorNotes } = req.body;

    if (!predictionId) {
      return res.status(400).json({ success: false, message: 'Prediction ID is required.' });
    }

    const record = await AIPrediction.findById(predictionId);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Prediction not found.' });
    }

    record.doctorFinalDiagnosis = doctorFinalDiagnosis || '';
    record.doctorNotes = doctorNotes || '';
    record.status = doctorFinalDiagnosis ? 'Reviewed' : record.status;
    await record.save();

    return res.json({ success: true, message: 'Diagnosis review updated.', data: record });
  } catch (error) {
    console.error('AI review update error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Unable to update review.' });
  }
};

export { buildPredictionResult, createDiagnosis, getPatientDiagnosisHistory, getAllDiagnosisRecords, updateDiagnosisReview };