import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [loading, setLoading] = useState(true); // start in loading state

  useEffect(() => {
    // ✅ Simulate loading when doctors are being fetched
    if (doctors && doctors.length > 0) {
      setLoading(false);
    }
  }, [doctors]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 dark:text-gray-300 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* ✅ Show loading spinner */}

      {
       loading ? (
        <div className="w-full flex justify-center items-center">
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
              <div
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  scrollTo(0, 0);
                }}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
                key={index}
              >
                <img
                  className="bg-blue-50 hover:bg-gradient-to-r from-[#D0D6FF] to-[#EDF0FF]"
                  src={item.image}
                  alt={item.name}
                />
                <div className="p-4">
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      item.available ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    <p
                      className={`w-2 h-2 ${
                        item.available ? "bg-green-500" : "bg-gray-500"
                      } rounded-full`}
                    ></p>
                    <p>{item.available ? "Available" : "Unavailable"}</p>
                  </div>
                  <p className="text-gray-900 dark:text-gray-100 text-lg font-medium">{item.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No doctors found.
            </p>
          )}
        </div>
      )}

      {/* ✅ Navigate to full doctor list */}
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 cursor-pointer hover:bg-blue-100 transition-all"
      >
        More
      </button>
    </div>
  );
};

export default TopDoctors;