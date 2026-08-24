import React, { useContext, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const symptomsList = [
  'fever',
  'cough',
  'headache',
  'sore_throat',
  'stomach pain',
  'rash',
  'fatigue',
  'diarrhea',
  'shortness of breath',
  'vomiting'
];

const SymptomChecker = () => {
  const navigate = useNavigate();
  const { backendUrl, token, userData } = useContext(AppContext);
  const [age, setAge] = useState('22');
  const [gender, setGender] = useState('male');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (value) => {
    setSelectedSymptoms((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const canSubmit = useMemo(() => selectedSymptoms.length > 0 && age && gender, [age, gender, selectedSymptoms]);

  const submitPrediction = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to use the symptom checker');
      navigate('/login');
      return;
    }

    if (!canSubmit) {
      toast.error('Select at least one symptom and enter age');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/ai/predict`,
        {
          age: Number(age),
          gender,
          symptoms: selectedSymptoms,
          userId: userData?._id
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success('Prediction generated successfully');
        navigate('/ai-results', { state: data.data });
      } else {
        toast.error(data.message || 'Unable to generate prediction');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-8 px-2 sm:px-0">
      <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">AI Symptom Checker</p>
          <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Check symptoms with AI assistance</h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            This checker uses a mock medical risk model for initial assistance only. It is not a final diagnosis and should be reviewed by a licensed professional.
          </p>
        </div>

        <form onSubmit={submitPrediction} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
            <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Select symptoms</h2>
            <div className="flex flex-wrap gap-3">
              {symptomsList.map((symptom) => {
                const isActive = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-blue-50 dark:bg-slate-900 dark:text-slate-200'}`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
            <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Patient details</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Age
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Gender
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                <p className="font-semibold">Assistance only</p>
                <p>AI suggestions are shared with the doctor for review and are not the final diagnosis.</p>
              </div>
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Generating prediction...' : 'Generate AI prediction'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SymptomChecker;
