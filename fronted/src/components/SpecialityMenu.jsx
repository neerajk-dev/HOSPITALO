import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <section
      className="flex flex-col items-center gap-4 py-16 text-gray-800 dark:text-gray-300"
      id="speciality"
      aria-labelledby="speciality-heading"
    >
      <h2
        id="speciality-heading"
        className="text-3xl font-medium"
      >
        Find Doctors by Speciality
      </h2>

      <p className="sm:w-1/3 text-center text-sm">
        Find trusted doctors by speciality and book your appointment
        online easily with Hospitalo.
      </p>

      {/* Speciality options */}
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            key={index}
            to={`/doctors/${item.speciality}`}
            aria-label={`Find ${item.speciality} doctors`}
          >
            <img
              className="w-16 sm:w-24 mb-2"
              src={item.image}
              alt={`${item.speciality} doctors`}
              loading="lazy"
            />

            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SpecialityMenu;