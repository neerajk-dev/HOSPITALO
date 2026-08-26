import React, { useEffect } from "react";
import { assets } from "../assets/assets";

const About = () => {
  // SEO metadata
  useEffect(() => {
    const title = "About Hospitalo - Smart Healthcare & Appointment Platform";

    const description =
      "Learn about Hospitalo, a smart healthcare platform that helps patients find trusted doctors, book online appointments, and manage their healthcare needs conveniently.";

    const canonicalUrl = "https://hospitalo-yjlj.onrender.com/about";

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

  return (
    <div>
      {/* Main SEO Heading */}
      <div className="text-center text-2xl pt-10 text-gray-500 dark:text-gray-300">
        <h1>
          ABOUT{" "}
          <span className="text-gray-700 dark:text-gray-500 font-medium">
            HOSPITALO
          </span>
        </h1>
      </div>

      {/* About section */}
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt="Hospitalo smart healthcare and doctor appointment platform"
          loading="lazy"
        />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Welcome to Hospitalo, a smart healthcare platform designed to make
            managing healthcare needs more convenient and accessible. Hospitalo
            helps patients find trusted doctors, explore medical specialities,
            and book doctor appointments online with ease.
          </p>

          <p>
            Hospitalo combines healthcare services with modern technology to
            simplify the appointment process. Whether you are looking for a
            doctor, scheduling an appointment, or exploring available
            healthcare services, Hospitalo provides a simple and convenient
            digital experience.
          </p>

          <p>
            We continuously work to improve Hospitalo by focusing on usability,
            accessibility, and a better experience for patients and healthcare
            users.
          </p>

          <h2 className="text-gray-800 dark:text-gray-300 font-semibold">
            Our Vision
          </h2>

          <p>
            Our vision at Hospitalo is to create a seamless digital healthcare
            experience that makes it easier for patients to connect with
            healthcare professionals. We aim to simplify doctor appointment
            booking and provide useful healthcare services through one
            convenient platform.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-xl my-4">
        <h2>
          WHY{" "}
          <span className="text-gray-700 dark:text-gray-500 font-semibold">
            CHOOSE HOSPITALO
          </span>
        </h2>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-col md:flex-row mb-20 gap-2">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 rounded-lg text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-400 cursor-pointer">
          <h3 className="font-semibold">Easy Appointment Booking</h3>

          <p>
            Find doctors by speciality and book appointments through a simple
            online process.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 rounded-lg text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-400 cursor-pointer">
          <h3 className="font-semibold">Trusted Doctors</h3>

          <p>
            Browse available healthcare professionals and explore their
            specialities before booking an appointment.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 rounded-lg text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-400 cursor-pointer">
          <h3 className="font-semibold">Convenient Healthcare</h3>

          <p>
            Access useful healthcare services and appointment features from
            one convenient online platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;