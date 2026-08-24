import mongoose from 'mongoose';

const aiPredictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  symptoms: [{ type: String }],
  predictions: [
    {
      disease: { type: String, required: true },
      match: { type: Number, required: true },
      matchedSymptoms: [{ type: String }]
    }
  ],
  risk: { type: String, default: 'Medium' },
  recommendedTests: [{ type: String }],
  doctorFinalDiagnosis: { type: String, default: '' },
  doctorNotes: { type: String, default: '' },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const AIPrediction = mongoose.models.AIPrediction || mongoose.model('AIPrediction', aiPredictionSchema);

export default AIPrediction;
