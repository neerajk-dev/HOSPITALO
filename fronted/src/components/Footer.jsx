import React, { useContext, useState } from "react";
import { assets } from "../assets/assets"; // Image assets
import { useNavigate } from "react-router-dom"; // For routing
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Footer = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);

  const [showFeedback, setShowFeedback] = useState(false);
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbMessage, setFbMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submitFeedback = async (e) => {
    e?.preventDefault();
    if (!fbMessage.trim()) return toast.warn("Please enter a message");

    try {
      setSending(true);

      const payload = { message: fbMessage };
      // agar user login nahi hai to naam/email bhej do agar diye gaye ho
      if (!token) {
        if (fbName.trim()) payload.name = fbName.trim();
        if (fbEmail.trim()) payload.email = fbEmail.trim();
      }

      const config = token ? { headers: { token } } : {};
      const { data } = await axios.post(`${backendUrl}/api/user/send-feedback`, payload, config);

      if (data?.success) {
        toast.success(data.message || "Feedback submitted");
        // OTP example ki tarah email store karna chahe to:
        if (!token && fbEmail) localStorage.setItem("fb_email", fbEmail);
        // reset form
        setFbMessage("");
        setFbName("");
        setFbEmail("");
        setShowFeedback(false);
      } else {
        toast.error(data?.message || "Failed to submit feedback");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Error sending feedback");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Left: Logo and Description */}
        <div>
          <img className="mb-5 w-40" src={assets.logon} alt="logo" />
          <p className="w-full md:w-2/3 text-gray-600 dark:text-gray-400 leading-6">
            Hospitalo is your trusted platform for managing prescriptions and healthcare needs online.
          </p>
        </div>

        {/* Center: Navigation Links */}
        <div>
          <p className="text-xl font-medium dark:text-gray-200 mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600 dark:text-gray-400">
            <li className="cursor-pointer" onClick={() => { navigate("/"); scrollTo(0,0); }}>Home</li>
            <li className="cursor-pointer" onClick={() => { navigate("/about"); scrollTo(0,0); }}>About us</li>
            <li className="cursor-pointer" onClick={() => { navigate("/contact"); scrollTo(0,0); }}>Contact us</li>
            <li className="cursor-pointer" onClick={() => { navigate("/pri-policy"); scrollTo(0,0); }}>Privacy policy</li>
          </ul>
        </div>

        {/* Right: Contact + Feedback */}
        <div>
          <p className="text-xl font-medium dark:text-gray-200 mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600 dark:text-gray-400 mb-4">
            <li>+7277959834</li>
            <li><a className="underline" href="mailto:neerajkr145518@gmail.com">neerajkr145518@gmail.com</a></li>
          </ul>

          <button
            onClick={() => setShowFeedback((s) => !s)}
            className="bg-[#5f6FFF] text-white px-4 py-2 rounded-md"
          >
            {showFeedback ? "Close Feedback" : "Send Feedback"}
          </button>

          {showFeedback && (
            <form onSubmit={submitFeedback} className="mt-4 p-3 bg-white dark:bg-[#4a4c52]/50 backdrop-blur-lg border rounded shadow-sm text-sm">
              {!token && (
                <>
                  <input
                    className="w-full mb-2 p-2 border rounded"
                    type="text"
                    placeholder="Your name (optional)"
                    value={fbName}
                    onChange={(e) => setFbName(e.target.value)}
                  />
                  <input
                    className="w-full mb-2 p-2 border rounded"
                    type="email"
                    placeholder="Your email (optional)"
                    value={fbEmail}
                    onChange={(e) => setFbEmail(e.target.value)}
                  />
                </>
              )}
              <textarea
                className="w-full mb-2 p-2 border rounded dark:bg-[#0f172a]/50  backdrop-blur-lg"
                rows="4"
                placeholder="Write your feedback..."
                value={fbMessage}
                onChange={(e) => setFbMessage(e.target.value)}
                required
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {sending ? "Sending..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowFeedback(false); }}
                  className="px-3 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright © 2025 Hospitalo - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
