import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const AIResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { symptomRecord, predictionRecord, summary } = location.state || {};

  const predictions = predictionRecord?.predictions || summary?.predictions || [];

  return (
    <div className="min-h-[80vh] py-8 px-2 sm:px-0">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
          <FiArrowLeft /> Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">AI Estimate</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-800 dark:text-slate-100">Top 3 possible conditions</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              These results are for assistance only. A doctor will confirm the final diagnosis after reviewing your symptoms.
            </p>
            <div className="mt-6 space-y-4">
              {predictions.map((item, index) => (
                <div key={`${item.disease}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{index + 1}. {item.disease}</p>
                    <p className="text-sm font-semibold text-blue-600">{item.confidence}%</p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${item.confidence}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Captured details</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                <p className="font-semibold">Age</p>
                <p>{symptomRecord?.age || 'N/A'}</p>
              </div>
              <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                <p className="font-semibold">Gender</p>
                <p>{symptomRecord?.gender || 'N/A'}</p>
              </div>
              <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                <p className="font-semibold">Symptoms</p>
                <p>{(symptomRecord?.symptoms || []).join(', ')}</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
              <p className="font-semibold">Important note</p>
              <p className="mt-2">Please consult a doctor for confirmation and follow-up care. AI assistance is meant to support clinical review.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResults;
