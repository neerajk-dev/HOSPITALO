import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stop loading when doctors are available
    if (doctors && doctors.length > 0) {
      setLoading(false);
    }
  }, [doctors]);

  return (
    <section
      className="flex flex-col items-center gap-4 my-16 text-gray-900 dark:text-gray-300 md:mx-10"
      aria-labelledby="top-doctors-heading"
    >
      <h2
        id="top-doctors-heading"
        className="text-3xl font-medium"
      >
        Top Doctors to Book Online
      </h2>

      <p className="sm:w-1/3 text-center text-sm">
        Browse trusted doctors by speciality and book your appointment
        online easily with Hospitalo.
      </p>

      {/* Loading spinner */}
      {loading ? (
        <div
          className="w-full flex justify-center items-center"
          role="status"
          aria-label="Loading doctors"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5f6FFF] border-t-transparent"></div>
        </div>
      ) : (
        <div
          className="w-full gap-4 pt-5 gap-y-6 px-3 sm:px-0"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {doctors && doctors.length > 0 ? (
            doctors.slice(0, 10).map((item, index) => (
              <article
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  scrollTo(0, 0);
                }}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
                key={item._id || index}
              >
                <img
                  className="bg-blue-50 hover:bg-gradient-to-r from-[#D0D6FF] to-[#EDF0FF]"
                  src={item.image}
                  alt={`${item.speciality} doctor ${item.name}`}
                  loading="lazy"
                />

                <div className="p-4">
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      item.available ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 ${
                        item.available ? "bg-green-500" : "bg-gray-500"
                      } rounded-full`}
                      aria-hidden="true"
                    ></span>

                    <p>
                      {item.available ? "Available" : "Unavailable"}
                    </p>
                  </div>

                  <h3 className="text-gray-900 dark:text-gray-100 text-lg font-medium">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.speciality}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No doctors found.
            </p>
          )}
        </div>
      )}

      {/* Navigate to full doctor list */}
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 cursor-pointer hover:bg-blue-100 transition-all"
        type="button"
      >
        View All Doctors
      </button>
    </section>
  );
};

export default TopDoctors;