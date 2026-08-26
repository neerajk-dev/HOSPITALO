import React, { useEffect } from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  useEffect(() => {
    const title = "Contact Hospitalo - Healthcare & Appointment Support";

    const description =
      "Contact Hospitalo for questions about our smart healthcare platform, online doctor appointments, and healthcare services.";

    const canonicalUrl = "https://hospitalo-yjlj.onrender.com/contact";

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
          CONTACT{" "}
          <span className="text-gray-700 dark:text-gray-500 font-semibold">
            HOSPITALO
          </span>
        </h1>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt="Contact Hospitalo healthcare platform"
          loading="lazy"
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <h2 className="font-semibold text-lg text-gray-600 dark:text-gray-200">
            Our Office
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            44 Chapra Station <br />
            841301, Chapra, INDIA
          </p>

          <p className="text-gray-500 dark:text-gray-400">
            Tel: 7277959834 <br />
            Email: neerajkr145518@gmail.com
          </p>

          <h2 className="font-semibold text-lg text-gray-600 dark:text-gray-200">
            Careers at Hospitalo
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            Learn more about our teams and job openings.
          </p>

          <button
            type="button"
            className="border border-black dark:border-white px-8 py-4 text-sm hover:bg-black dark:bg-gray-600 hover:text-white transition-all duration-500"
          >
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;