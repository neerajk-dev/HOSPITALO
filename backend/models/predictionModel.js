import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  symptomId: { type: mongoose.Schema.Types.ObjectId, ref: 'symptom', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', default: null },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  predictions: [
    {
      disease: { type: String, required: true },
      confidence: { type: Number, required: true }
    }
  ],
  status: { type: String, enum: ['pending', 'reviewed', 'approved', 'rejected'], default: 'pending' },
  note: { type: String, default: 'Assistance Only — not a final diagnosis.' },
  createdAt: { type: Date, default: Date.now }
});

const predictionModel = mongoose.models.prediction || mongoose.model('prediction', predictionSchema);

export default predictionModel;
