import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const symptomOptions = [
  "fever",
  "cough",
  "headache",
  "sore throat",
  "stomach pain",
  "body pain",
  "vomiting",
  "weakness",
  "chills",
  "sweating",
  "diarrhea",
  "runny nose",
];

const AIDiagnosis = () => {
  const navigate = useNavigate();
  const { backendUrl, token, userData } = useContext(AppContext);

  const [age, setAge] = useState("22");
  const [gender, setGender] = useState("male");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);

  // =========================
  // SEO
  // =========================
  useEffect(() => {
    const title =
      "AI Diagnosis - Hospitalo Smart Healthcare Platform";

    const description =
      "Use Hospitalo's AI diagnosis tool to review symptoms, explore possible health conditions, and view suggested tests. This tool is for informational purposes and is not a substitute for professional medical advice.";

    const canonicalUrl =
      "https://hospitalo-yjlj.onrender.com/ai-diagnosis";

    document.title = title;

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute("content", description);

    let canonicalTag = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute("href", canonicalUrl);

    return () => {
      document.title =
        "Hospitalo - Smart Hospital Management & Appointment System";
    };
  }, []);

  // =========================
  // Load previous AI history
  // =========================
  const loadHistory = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/ai/history`,
        {
          headers: { token },
        }
      );

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

  // =========================
  // Toggle symptoms
  // =========================
  const toggleSymptom = (value) => {
    setSelectedSymptoms((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // =========================
  // Form validation
  // =========================
  const canSubmit = useMemo(
    () => selectedSymptoms.length > 0 && age && gender,
    [age, gender, selectedSymptoms]
  );

  // =========================
  // Submit diagnosis
  // =========================
  const submitDiagnosis = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please login to use AI diagnosis");
      navigate("/login");
      return;
    }

    if (!canSubmit) {
      toast.error("Select at least one symptom and enter age");
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
          userId: userData?._id,
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        const responseData =
          data.data?.result || data.data || null;

        setResult(responseData);

        setHistory((prev) => [
          data.data?.prediction,
          ...prev,
        ]);

        toast.success("AI diagnosis generated successfully");
      } else {
        toast.error(
          data.message || "Unable to generate diagnosis"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Diagnosis request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-8 px-2 sm:px-0">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900">
        
        {/* =========================
            SEO Heading
        ========================= */}
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            AI Diagnosis
          </p>

          <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
            AI Symptom Checker & Disease Prediction
          </h1>

          <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            Hospitalo's AI diagnosis tool reviews selected symptoms
            and provides possible health condition suggestions for
            informational purposes. Results should always be reviewed
            with a qualified medical professional.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          
          {/* =========================
              Symptom Form
          ========================= */}
          <form
            onSubmit={submitDiagnosis}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70"
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Select Symptoms
            </h2>

            <div className="mb-5 flex flex-wrap gap-3">
              {symptomOptions.map((symptom) => {
                const isActive =
                  selectedSymptoms.includes(symptom);

                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow"
                        : "bg-white text-slate-700 hover:bg-blue-50 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>

            {/* Age & Gender */}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Age

                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(event) =>
                    setAge(event.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Gender

                <select
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Generating prediction..."
                : "Generate AI Diagnosis"}
            </button>
          </form>

          {/* =========================
              Result Section
          ========================= */}
          <div className="space-y-6">
            {result ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                      Prediction Result
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {result.disease ||
                        result.prediction ||
                        result.diagnosis ||
                        "Possible condition"}
                    </h2>
                  </div>
                </div>

                {result.description && (
                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {result.description}
                  </p>
                )}

                {result.confidence !== undefined && (
                  <div className="mt-5">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Confidence
                    </p>

                    <p className="mt-1 text-lg font-semibold text-blue-600">
                      {result.confidence}%
                    </p>
                  </div>
                )}

                {result.tests && result.tests.length > 0 && (
                  <div className="mt-5">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      Suggested Tests
                    </h3>

                    <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                      {result.tests.map((test, index) => (
                        <li key={index}>{test}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-5 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                  <strong>Important:</strong> This AI result is
                  for informational purposes only. It is not a
                  medical diagnosis. Please consult a qualified
                  healthcare professional for proper evaluation
                  and treatment.
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  How AI Diagnosis Works
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Select the symptoms you are experiencing, enter
                  your age and gender, and generate a prediction.
                  Hospitalo compares the selected symptoms with
                  predefined health-condition rules.
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  The result provides possible conditions for
                  informational purposes and should not replace
                  professional medical advice.
                </p>
              </div>
            )}

            {/* =========================
                History
            ========================= */}
            {history.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
                <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Previous AI Predictions
                </h2>

                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={item?._id || index}
                      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <p className="font-medium text-slate-800 dark:text-slate-100">
                        {item?.disease ||
                          item?.prediction ||
                          item?.diagnosis ||
                          "Prediction"}
                      </p>

                      {item?.createdAt && (
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosis;