import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';

const DoctorDiagnosis = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [doctorNote, setDoctorNote] = useState('');
  const [status, setStatus] = useState('approved');

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/ai/doctor-review`, {
        headers: { dtoken: dToken }
      });
      if (data.success) {
        setQueue(data.data || []);
      } else {
        toast.error(data.message || 'Unable to fetch review queue');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to fetch review queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const selectedPrediction = useMemo(() => queue.find((item) => item._id === selectedReview) || null, [queue, selectedReview]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!selectedPrediction) {
      toast.error('Select a prediction first');
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/ai/review`, {
        predictionId: selectedPrediction._id,
        status,
        doctorId: selectedPrediction.doctorId || null,
        finalDiagnosis,
        doctorNote
      }, {
        headers: { dtoken: dToken }
      });

      if (data.success) {
        toast.success('Diagnosis review saved');
        setSelectedReview(null);
        setFinalDiagnosis('');
        setDoctorNote('');
        await fetchQueue();
      } else {
        toast.error(data.message || 'Unable to save review');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save review');
    }
  };

  return (
    <div className="min-h-[80vh] w-full px-4 py-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Doctor Review</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-800 dark:text-slate-100">Review AI-assisted diagnoses</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Doctors can review the AI prediction, approve or reject it, and enter the final diagnosis.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
              <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Pending reviews</h2>
              <div className="space-y-3">
                {queue.length === 0 ? (
                  <p className="rounded-xl bg-white p-4 text-sm text-slate-500 dark:bg-slate-900">No pending AI reviews yet.</p>
                ) : queue.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      setSelectedReview(item._id);
                      setFinalDiagnosis('');
                      setDoctorNote('');
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${selectedReview === item._id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900'}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{item.symptomId?.symptoms?.join(', ') || 'Symptoms recorded'}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Top suggestion: {item.predictions?.[0]?.disease || 'Not available'}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={submitReview} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
              {selectedPrediction ? (
                <>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Review details</h2>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Symptoms</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{selectedPrediction.symptomId?.symptoms?.join(', ')}</p>
                    </div>

                    <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">AI predictions</p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        {selectedPrediction.predictions?.map((item, index) => (
                          <li key={`${item.disease}-${index}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                            <span>{item.disease}</span>
                            <span className="font-semibold text-blue-600">{item.confidence}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Final diagnosis
                      <input
                        type="text"
                        value={finalDiagnosis}
                        onChange={(event) => setFinalDiagnosis(event.target.value)}
                        placeholder="Enter final diagnosis"
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900"
                        required
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Doctor note
                      <textarea
                        value={doctorNote}
                        onChange={(event) => setDoctorNote(event.target.value)}
                        rows="3"
                        placeholder="Add clinical notes"
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900"
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Decision
                      <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900"
                      >
                        <option value="approved">Approve AI suggestion</option>
                        <option value="rejected">Reject AI suggestion</option>
                      </select>
                    </label>

                    <button type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">
                      Save review
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl bg-white p-6 text-center text-sm text-slate-500 dark:bg-slate-900">
                  Select a patient review from the list to continue.
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDiagnosis;
