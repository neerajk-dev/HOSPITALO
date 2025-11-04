import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      {/* Heading: About Us */}
      <div className="text-center text-2xl pt-10 text-gray-500 dark:text-gray-300">
        <p>
          ABOUT <span className="text-gray-700 dark:text-gray-500 font-medium">US</span>
        </p>
      </div>

      {/* About section with image and text */}
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Welcome To hospitalo, Your Trusted Partner In Managing Your
            Healthcare Needs Conveniently And Efficiently Af hospitalo, We
            Understand The Challenges Individuals Face When It Comes To
            Scheduling Doctor Appointments And Managing Their Health Records.
          </p>
          <p>
            hospitalo is Committed To Excellence in Healthcare Technology. We
            Continuously Strive To Enhance Our Platform, Integrating The Latest
            Advancements To Improve User Experience And Deliver Superior
            Service. Whether You're Booking Your First Appointment Or Managing
            Ongoing Care, hospitalo Is Here To Support You Every Step Of The
            Way.
          </p>
          <b className="text-gray-800 dark:text-gray-300">Our Vision</b>
          <p>
            Our Vision At hospitalo is To Create A Seamless Healthcare
            Experience For Every User. We Aim To Bridge The Gap Between Patients
            And Healthcare Providers, Making It Easier For You To Access The
            Care You Need. When You Need It
          </p>
        </div>
      </div>

      {/* Heading: Why Choose Us */}
      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 dark:text-gray-500 font-semibold">CHOOSE US</span>
        </p>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-col md:flex-row mb-20 gap-2">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 rounded-lg text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-400 cursor-pointer">
          <b>Efficiency</b>
          <p>
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 rounded-lg  text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-400 cursor-pointer">
          <b>Convenience:</b>
          <p>
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 rounded-lg  text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-400 cursor-pointer">
          <b>Personalization:</b>
          <p>
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;