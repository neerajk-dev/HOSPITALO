import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500 dark:text-gray-300">
        <p>
          CONTACT <span className="text-gray-700 dark:text-gray-500 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600 dark:text-gray-200">Our OFFICE</p>

          <p className="text-gray-500 dark:text-gray-400">
            44 Chhapra Station <br /> 841301, Chapra, INDIA
          </p>

          <p className="text-gray-500 dark:text-gray-400">
            Tel: 7277959834 <br /> Email: neerajkr145518@gmail.com
          </p>

          <p className="font-semibold text-lg text-gray-600 dark:text-gray-200">
            Careers at hospitalo
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black dark:border-white px-8 py-4 text-sm hover:bg-black dark:bg-gray-600 hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;