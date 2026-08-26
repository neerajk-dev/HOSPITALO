import React, { useEffect, useState } from "react";

const PrivPolicy = ({ lastUpdated = "November 4, 2025" }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggle = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  // =========================
  // SEO
  // =========================
  useEffect(() => {
    const title =
      "Privacy Policy - Hospitalo Smart Hospital Management System";

    const description =
      "Read Hospitalo's Privacy Policy to learn how we collect, use, protect and manage personal, medical, appointment and payment information.";

    const canonicalUrl =
      "https://hospitalo-yjlj.onrender.com/pri-policy";

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

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      body: (
        <>
          <p className="mb-2">
            Welcome to <strong>Hospitalo</strong> — a smart
            hospital appointment system. This Privacy Policy
            explains how we collect, use and safeguard your
            personal information when you use our website or app.
          </p>

          <p>
            If you do not agree with this policy, please do not use
            our services.
          </p>
        </>
      ),
    },

    {
      id: "info-we-collect",
      title: "Information We Collect",
      body: (
        <>
          <h3 className="font-medium mt-2">
            Personal Information
          </h3>

          <ul className="list-disc ml-5 mb-3">
            <li>
              Full name, email, phone, address (optional), DOB.
            </li>
            <li>
              Account credentials (securely hashed passwords).
            </li>
          </ul>

          <h3 className="font-medium">
            Medical & Appointment Information
          </h3>

          <ul className="list-disc ml-5 mb-3">
            <li>
              Doctor name, specialization, appointment details.
            </li>
            <li>
              Uploaded reports, prescriptions (if you upload
              them).
            </li>
          </ul>

          <h3 className="font-medium">
            Payment Information
          </h3>

          <p className="mb-3">
            We store payment transaction IDs and status. Card data
            is handled by third-party gateways.
          </p>

          <h3 className="font-medium">
            Technical & Usage Data
          </h3>

          <p>
            IP address, device/browser information, cookies and
            analytics data.
          </p>
        </>
      ),
    },

    {
      id: "how-we-use",
      title: "How We Use Your Information",
      body: (
        <>
          <p className="mb-2">
            We use information to:
          </p>

          <ul className="list-disc ml-5">
            <li>Create and manage accounts.</li>
            <li>
              Book, modify, cancel appointments and send
              notifications.
            </li>
            <li>
              Process payments and refunds via payment gateways
              such as Razorpay.
            </li>
            <li>
              Improve service, analytics and security.
            </li>
            <li>Comply with legal obligations.</li>
          </ul>
        </>
      ),
    },

    {
      id: "security",
      title: "Security of Your Data",
      body: (
        <>
          <p className="mb-2">
            We implement industry-standard safeguards including:
          </p>

          <ul className="list-disc ml-5">
            <li>SSL/TLS for data in transit.</li>
            <li>
              Hashed passwords and secure database storage.
            </li>
            <li>Access controls and regular audits.</li>
          </ul>

          <p className="mt-2">
            While we strive to protect data, no system is 100%
            secure.
          </p>
        </>
      ),
    },

    {
      id: "sharing",
      title: "Data Sharing & Third Parties",
      body: (
        <>
          <p className="mb-2">
            We do not sell personal data. We may share data with:
          </p>

          <ul className="list-disc ml-5">
            <li>
              Doctors and hospitals for treatment and appointment
              purposes.
            </li>
            <li>
              Service providers such as payment gateways and email
              providers.
            </li>
            <li>Law enforcement if required by law.</li>
          </ul>
        </>
      ),
    },

    {
      id: "retention",
      title: "Data Retention",
      body: (
        <p>
          We keep data as long as needed to provide services, to
          meet legal obligations or to resolve disputes. When you
          delete your account, we remove personal data except where
          retention is required by law.
        </p>
      ),
    },

    {
      id: "cookies",
      title: "Cookies & Tracking",
      body: (
        <p>
          We use cookies to improve user experience, remember
          preferences and run analytics. You can disable cookies
          in your browser, but some features may not work
          correctly.
        </p>
      ),
    },

    {
      id: "rights",
      title: "Your Rights",
      body: (
        <p>
          You may request access, correction or deletion of your
          data, or withdraw consent. To exercise these rights,
          contact us using the contact details below.
        </p>
      ),
    },

    {
      id: "children",
      title: "Children's Privacy",
      body: (
        <p>
          Our services are for users 18+. If we discover data from
          children under 18 without parental consent, we will
          delete it.
        </p>
      ),
    },

    {
      id: "contact",
      title: "Contact & Updates",
      body: (
        <>
          <p className="mb-2">
            Questions or requests regarding this policy can be sent
            to:
          </p>

          <p className="font-medium">
            neerajkr145518@gmail.com
          </p>

          <p className="mt-2">
            We may update this policy — the{" "}
            <strong>Last Updated</strong> date above will reflect
            changes.
          </p>
        </>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-600/50 backdrop-blur-xl rounded-[4px] py-8 px-4 md:px-8 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 md:p-10">

          {/* =========================
              Page Header
          ========================= */}
          <header>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200">
              Hospitalo Privacy Policy
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Privacy Policy for Hospitalo — Smart Hospital
              Appointment System
            </p>

            <p className="text-xs text-slate-400 dark:text-slate-300 mt-2">
              Last Updated:{" "}
              <span className="font-medium">
                {lastUpdated}
              </span>
            </p>
          </header>

          <div className="mt-6 grid md:grid-cols-4 gap-6">

            {/* =========================
                Table of Contents
            ========================= */}
            <aside className="md:col-span-1 hidden md:block">
              <nav
                aria-label="Privacy policy sections"
                className="sticky top-6 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border"
              >
                <h2 className="text-sm font-semibold mb-3">
                  On this page
                </h2>

                <ul className="space-y-2 text-sm">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block hover:text-sky-600 truncate"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* =========================
                Main Content
            ========================= */}
            <section className="md:col-span-3">

              <div className="text-sm leading-6 text-slate-700 dark:text-slate-400">
                <p>
                  This Privacy Policy describes how Hospitalo
                  collects, uses and protects your information when
                  you use our healthcare appointment and management
                  services.
                </p>
              </div>

              <div className="mt-6 space-y-4">

                {sections.map((section) => (
                  <article
                    id={section.id}
                    key={section.id}
                    className="bg-white dark:bg-gray-900 border rounded-lg p-4 scroll-mt-24"
                  >
                    <header className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        {section.title}
                      </h2>

                      <button
                        type="button"
                        onClick={() =>
                          toggle(section.id)
                        }
                        aria-expanded={
                          openSection === section.id
                        }
                        aria-controls={`${section.id}-content`}
                        className="shrink-0 text-sm px-3 py-1 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        {openSection === section.id
                          ? "Collapse"
                          : "Expand"}
                      </button>
                    </header>

                    <div
                      id={`${section.id}-content`}
                      className={`mt-3 text-sm leading-6 text-slate-700 dark:text-slate-400 ${
                        openSection === section.id
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      {section.body}
                    </div>

                    {openSection !== section.id && (
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        Click "Expand" to read this section.
                      </p>
                    )}
                  </article>
                ))}

              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivPolicy;