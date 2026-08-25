import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-gradient-to-r from-[#3A4FFF] to-[#202C80] rounded-lg px-6 md:px-10 lg:px-20">
      
      {/*----------- LEFT SIDE -----------*/}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto mf:py-[10vw] md:mb-[-30px]">
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
          Smart Hospital Management & Online Doctor Appointment System
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <img
            className="w-28"
            src={assets.group_profiles}
            alt="Trusted doctors available on Hospitalo"
          />

          <p>
            Book appointments with trusted doctors and manage your healthcare
            journey easily with Hospitalo.
            <br className="hidden sm:block" />
            Browse doctors, choose a speciality, and schedule your appointment
            hassle-free.
          </p>
        </div>

        <a
          href="#speciality"
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300"
        >
          Book appointment
          <img
            className="w-3"
            src={assets.arrow_icon}
            alt=""
          />
        </a>
      </div>

      {/*----------- RIGHT SIDE -----------*/}
      <div className="md:w-1/2 relative">
        <img
          className="w-full md:absolute lg:relative bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt="Hospitalo smart hospital management and doctor appointment platform"
        />
      </div>
    </div>
  );
};

export default Header;