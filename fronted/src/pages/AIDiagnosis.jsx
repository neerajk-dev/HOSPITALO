import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const symptomOptions = [
  'fever',
  'cough',
  'headache',
  'sore throat',
  'stomach pain',
  'body pain',
  'vomiting',
  'weakness',
  'chills',
  'sweating',
  'diarrhea',
  'runny nose'
];

const AIDiagnosis = () => {
  const navigate = useNavigate();
  const { backendUrl, token, userData } = useContext(AppContext);
  const [age, setAge] = useState('22');
  const [gender, setGender] = useState('male');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);

  // Load the patient's past AI predictions whenever the page opens.
  const loadHistory = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${backendUrl}/api/ai/history`, {
        headers: { token }
      });

      if (data.success) {
        setHistory(data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [token]);

  const toggleSymptom = (value) => {
    setSelectedSymptoms((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const canSubmit = useMemo(() => selectedSymptoms.length > 0 && age && gender, [age, gender, selectedSymptoms]);

  // Submit the symptom list and save the AI diagnosis to MongoDB.
  const submitDiagnosis = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error('Please login to use AI diagnosis');
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
        const responseData = data.data?.result || data.data || null;
        setResult(responseData);
        setHistory((prev) => [data.data?.prediction, ...prev]);
        toast.success('AI diagnosis generated successfully');
      } else {
        toast.error(data.message || 'Unable to generate diagnosis');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Diagnosis request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-8 px-2 sm:px-0">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">AI Diagnosis</p>
          <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Rule-based disease prediction</h1>
          <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            This simple JavaScript engine compares your symptoms to common disease rules and returns the top prediction suggestions for review by a medical professional.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={submitDiagnosis} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
            <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Select symptoms</h2>
            <div className="mb-5 flex flex-wrap gap-3">
              {symptomOptions.map((symptom) => {
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

            <div className="grid gap-4 md:grid-cols-2">
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
            </div>

            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Generating prediction...' : 'Generate AI diagnosis'}
            </button>
          </form>

          <div className="space-y-6">
            {result ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Prediction summary</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-800 dark:text-slate-100">Top 3 possible conditions</h2>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    Risk: {result.risk}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {result.predictions?.map((item, index) => (
                    <div key={`${item.disease}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{index + 1}. {item.disease}</p>
                        <p className="text-sm font-semibold text-blue-600">{item.match}%</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${item.match}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-200">Recommended tests</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.recommendedTests?.map((test) => (
                      <span key={test} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                        {test}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/70">
                Submit symptoms to view disease predictions and suggested tests.
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Previous predictions</h2>
              <div className="mt-4 space-y-3">
                {history.length === 0 ? (
                  <p className="rounded-xl bg-white p-3 text-sm text-slate-500 dark:bg-slate-900">No previous AI diagnoses yet.</p>
                ) : history.slice(0, 5).map((item) => (
                  <div key={item._id} className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.predictions?.[0]?.disease || 'Review pending'}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.risk || 'Medium'}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosis;
