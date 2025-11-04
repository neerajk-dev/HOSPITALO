import React, { useState } from 'react'

const PrivPolicy = ({ lastUpdated = "[Insert Date]" }) => {

    const [openSection, setOpenSection] = useState(null);

    const toggle = (id) => setOpenSection(openSection === id ? null : id);

    const sections = [
    {
      id: "introduction",
      title: "Introduction",
      body: (
        <>
          <p className="mb-2">
            Welcome to <strong>Hospitalo</strong> — a smart hospital appointment
            system. This Privacy Policy explains how we collect, use and
            safeguard your personal information when you use our website or app.
          </p>
          <p>If you do not agree with this policy, please do not use our services.</p>
        </>
      ),
    },
    {
      id: "info-we-collect",
      title: "Information We Collect",
      body: (
        <>
          <h4 className="font-medium mt-2">Personal Information</h4>
          <ul className="list-disc ml-5 mb-3">
            <li>Full name, email, phone, address (optional), DOB.</li>
            <li>Account credentials (securely hashed passwords).</li>
          </ul>

          <h4 className="font-medium">Medical & Appointment Information</h4>
          <ul className="list-disc ml-5 mb-3">
            <li>Doctor name, specialization, appointment details.</li>
            <li>Uploaded reports, prescriptions (if you upload them).</li>
          </ul>

          <h4 className="font-medium">Payment Information</h4>
          <p className="mb-3">We store payment transaction IDs and status. Card data is handled by third-party gateways.</p>

          <h4 className="font-medium">Technical & Usage Data</h4>
          <p>IP address, device/browser info, cookies, and analytics data.</p>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      body: (
        <>
          <p className="mb-2">We use information to:</p>
          <ul className="list-disc ml-5">
            <li>Create and manage accounts.</li>
            <li>Book, modify, cancel appointments and send notifications.</li>
            <li>Process payments and refunds via payment gateways (e.g. Razorpay).</li>
            <li>Improve service, analytics, and security.</li>
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
          <p className="mb-2">We implement industry-standard safeguards including:</p>
          <ul className="list-disc ml-5">
            <li>SSL/TLS for data in transit.</li>
            <li>Hashed passwords and secure database storage.</li>
            <li>Access controls and regular audits.</li>
          </ul>
          <p className="mt-2">While we strive to protect data, no system is 100% secure.</p>
        </>
      ),
    },
    {
      id: "sharing",
      title: "Data Sharing & Third Parties",
      body: (
        <>
          <p className="mb-2">We do not sell personal data. We may share data with:</p>
          <ul className="list-disc ml-5">
            <li>Doctors and hospitals for treatment and appointment purposes.</li>
            <li>Service providers (payment gateways, email providers).</li>
            <li>Law enforcement if required by law.</li>
          </ul>
        </>
      ),
    },
    {
      id: "retention",
      title: "Data Retention",
      body: (
        <>
          <p className="mb-2">We keep data as long as needed to provide services, to meet legal obligations, or to resolve disputes. When you delete your account we remove personal data except where retention is required by law.</p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      body: (
        <>
          <p className="mb-2">We use cookies to improve UX, remember preferences, and run analytics. You can disable cookies in your browser, but some features may not work correctly.</p>
        </>
      ),
    },
    {
      id: "rights",
      title: "Your Rights",
      body: (
        <>
          <p className="mb-2">You may request access, correction or deletion of your data, or withdraw consent. To exercise these rights contact us (contact details below).</p>
        </>
      ),
    },
    {
      id: "children",
      title: "Children's Privacy",
      body: (
        <>
          <p className="mb-2">Our services are for users 18+. If we discover data from children under 18 without parental consent, we will delete it.</p>
        </>
      ),
    },
    {
      id: "contact",
      title: "Contact & Updates",
      body: (
        <>
          <p className="mb-2">Questions or requests regarding this policy can be sent to:</p>
          <p className="font-medium">neerajkr145518@gmail.com</p>
          <p className="mt-2">We may update this policy — the <strong>Last Updated</strong> date above will reflect changes.</p>
        </>
      ),
    },
  ];


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-600/50 backdrop-blur-xl rounded-[4px]  py-8 px-4 md:px-8 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200">Privacy Policy</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Hospitalo — Smart Hospital Appointment System</p>
              <p className="text-xs text-slate-400 dark:text-slate-300 mt-2">Last Updated: <span className="font-medium">{lastUpdated}</span></p>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 border rounded-md dark:bg-gray-600/50 backdrop-blur-3xl text-sm hover:shadow-sm"
              >
                Print
              </button>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-4 gap-6">
            {/* Sidebar / TOC */}
            <aside className="md:col-span-1 hidden md:block">
              <nav className="sticky top-6 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border">
                <h3 className="text-sm font-semibold mb-3">On this page</h3>
                <ul className="space-y-2 text-sm">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block hover:text-sky-600 truncate"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <main className="md:col-span-3">
              <section className="prose max-w-none text-slate-700 dark:text-slate-400">
                <p className="mt-2">This Privacy Policy describes how Hospitalo collects and uses your information when you use our services.</p>
              </section>

              <div className="mt-6 space-y-4">
                {sections.map((s) => (
                  <article id={s.id} key={s.id} className="bg-white dark:bg-gray-900 border rounded-lg p-4">
                    <header className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{s.title}</h2>
                      <button
                        onClick={() => toggle(s.id)}
                        aria-expanded={openSection === s.id}
                        className="text-sm px-2 py-1 border rounded-md"
                      >
                        {openSection === s.id ? "Collapse" : "Expand"}
                      </button>
                    </header>

                    <div className={`mt-3 text-sm text-slate-700 dark:text-slate-400 ${openSection === s.id ? "block" : "hidden"}`}>
                      {s.body}
                    </div>

                    {/* show short preview when collapsed */}
                    <div className={`mt-3 text-sm text-slate-600 dark:text-slate-400 ${openSection === s.id ? "hidden" : "block"}`}>
                      <p>
                        {typeof s.body === "object"
                          ? (Array.isArray(s.body.props?.children) ? s.body.props.children[0]?.props?.children : null)
                          : null}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </main>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default PrivPolicy