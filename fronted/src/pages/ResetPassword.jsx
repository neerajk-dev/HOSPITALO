import React, { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState("email");

  const inputRefs = useRef([]);

  // Step from URL param
  const getStepFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("step") || "email";
  };

  const setStepInURL = (step) => {
    const params = new URLSearchParams(window.location.search);
    params.set("step", step);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  // Restore state on reload
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedOtp = localStorage.getItem("otp");
    const stepFromUrl = getStepFromURL();

    if (storedEmail) setEmail(storedEmail);
    if (stepFromUrl === "otp") {
      setStep("otp");
    } else if (stepFromUrl === "new-password") {
      if (storedEmail && storedOtp) {
        setEmail(storedEmail);
        setOtp(storedOtp);
        setStep("new-password");
      } else {
        setStep("email");
        setStepInURL("email");
      }
    } else {
      setStep("email");
    }
  }, []);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // Step 1: Send Email
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("email", email);
        setStep("otp");
        setStepInURL("otp");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Step 2: Verify OTP (backend call)
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el.value);
    const finalOtp = otpArray.join('');

    if (finalOtp.length !== 6) {
      return toast.error("Please enter a 6-digit OTP");
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, {
        email,
        otp: finalOtp,
      });

      if (data.success) {
        toast.success(data.message);
        setOtp(finalOtp);
        localStorage.setItem("otp", finalOtp);
        setStep("new-password");
        setStepInURL("new-password");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong while verifying OTP.");
    }
  };

  // Step 3: Submit New Password
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, {
        email,
        otp,
        newPassword
      });

      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("email");
        localStorage.removeItem("otp");
        setStep("email");
        setStepInURL("email");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-[65vh] px-3 sm:px-0'>

      {/* Step 1: Email Form */}
      {step === "email" && (
        <form onSubmit={onSubmitEmail} className='p-8 rounded-lg shadow-lg w-96 text-sm border text-zinc-600 dark:text-zinc-300'>
          <h1 className='text-2xl font-semibold text-center mb-4'>Reset password</h1>
          <p className='text-center mb-6'>Enter your registered email address</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded border'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input
              type="email"
              placeholder='Email id'
              className='bg-transparent outline-none text-zinc-600 dark:text-zinc-300 text-lg flex-1'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button className='bg-[#5f6FFF] hover:opacity-85 cursor-pointer text-white w-full py-2 rounded-md text-base'>
            Submit
          </button>
        </form>
      )}

      {/* Step 2: OTP Form */}
      {step === "otp" && (
        <form onSubmit={onSubmitOTP} className='p-8 rounded-lg shadow-lg w-96 text-sm border text-zinc-600 dark:text-zinc-300'>
          <h1 className='text-2xl font-semibold text-center mb-4'>Enter OTP</h1>
          <p className='text-center mb-6'>Enter the 6-digit code sent to your email</p>
          <div className='flex gap-1 justify-between mb-8 gap-x-2' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className='w-12 h-12 bg-gray-100 text-black dark:bg-gray-700 dark:text-white  text-center text-xl rounded-md'
                ref={el => inputRefs.current[index] = el}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button className='bg-[#5f6FFF] hover:opacity-85 cursor-pointer text-white w-full py-2 rounded-md text-base'>
            Submit
          </button>
        </form>
      )}

      {/* Step 3: New Password */}
      {step === "new-password" && (
        <form onSubmit={onSubmitNewPassword} className='p-8 rounded-lg shadow-lg w-96 text-sm border text-zinc-600 dark:text-zinc-300'>
          <h1 className='text-2xl font-semibold text-center mb-4'>New password</h1>
          <p className='text-center mb-6'>Enter the new password below</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded border relative'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='New password'
              className='bg-transparent outline-none text-zinc-600 dark:text-zinc-300 flex-1 text-lg'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-4 text-zinc-500 hover:text-zinc-800"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button className='bg-[#5f6FFF] hover:opacity-85 cursor-pointer text-white w-full py-2 rounded-md text-base'>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;