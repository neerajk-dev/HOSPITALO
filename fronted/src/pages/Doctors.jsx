import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  // Apply doctor speciality filter
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter((doc) => doc.speciality === speciality)
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  // Update loading state when doctors are available
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      setLoading(false);
    }
  }, [doctors]);

  // SEO metadata
  useEffect(() => {
    const pageTitle = speciality
      ? `${speciality} Doctors - Book Appointment | Hospitalo`
      : "Find Doctors & Book Appointments | Hospitalo";

    const pageDescription = speciality
      ? `Find trusted ${speciality} doctors and book online appointments easily with Hospitalo. Browse available doctors and choose a convenient appointment.`
      : "Find trusted doctors by speciality and book online doctor appointments easily with Hospitalo.";

    const canonicalUrl = speciality
      ? `https://hospitalo-yjlj.onrender.com/doctors/${encodeURIComponent(
          speciality
        )}`
      : "https://hospitalo-yjlj.onrender.com/doctors";

    document.title = pageTitle;

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute("content", pageDescription);

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
  }, [speciality]);

  return (
    <div>
      {/* SEO-friendly page heading */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          {speciality
            ? `${speciality} Doctors`
            : "Find Trusted Doctors & Book Appointments"}
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
          {speciality
            ? `Browse trusted ${speciality} doctors and book an online appointment through Hospitalo.`
            : "Browse our list of trusted doctors by speciality and book your appointment online with Hospitalo."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Mobile filter button */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-[#5f6FFF] text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        {/* Speciality filters */}
        <div
          className={`flex-col gap-4 text-sm text-gray-600 dark:text-gray-400 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() =>
              speciality === "General physician"
                ? navigate("/doctors")
                : navigate("/doctors/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-200 rounded transition-all cursor-pointer ${
              speciality === "General physician"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            General physician
          </p>

          <p
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-200 rounded transition-all cursor-pointer ${
              speciality === "Gynecologist"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Gynecologist
          </p>

          <p
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/Dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-200 rounded transition-all cursor-pointer ${
              speciality === "Dermatologist"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Dermatologist
          </p>

          <p
            onClick={() =>
              speciality === "Pediatricians"
                ? navigate("/doctors")
                : navigate("/doctors/Pediatricians")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-200 rounded transition-all cursor-pointer ${
              speciality === "Pediatricians"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Pediatricians
          </p>

          <p
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/Neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-200 rounded transition-all cursor-pointer ${
              speciality === "Neurologist"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Neurologist
          </p>

          <p
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 dark:border-gray-200 rounded transition-all cursor-pointer ${
              speciality === "Gastroenterologist"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Gastroenterologist
          </p>
        </div>

        {/* Doctors */}
        {loading ? (
          <div className="w-full md:h-[40vh] h-[20vh] flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5f6FFF] border-t-transparent"></div>
          </div>
        ) : (
          <div
            className="w-full grid gap-4 gap-y-6"
            style={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {filterDoc.length > 0 ? (
              filterDoc.map((item, index) => (
                <div
                  onClick={() => {
                    navigate(`/appointment/${item._id}`);
                    scrollTo(0, 0);
                  }}
                  className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
                  key={item._id || index}
                >
                  <img
                    className="bg-blue-50 w-full"
                    src={item.image}
                    alt={`${item.name} - ${item.speciality} at Hospitalo`}
                    loading="lazy"
                  />

                  <div className="p-4">
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        item.available
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      <p
                        className={`w-2 h-2 ${
                          item.available
                            ? "bg-green-500"
                            : "bg-gray-500"
                        } rounded-full`}
                      ></p>

                      <p>
                        {item.available
                          ? "Available"
                          : "Unavailable"}
                      </p>
                    </div>

                    <p className="text-gray-900 dark:text-gray-200 text-lg font-medium">
                      {item.name}
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.speciality}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No doctors found for this speciality.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;