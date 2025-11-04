import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setSending(true);
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center ">
      <div className=" flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 dark:text-zinc-300  text-sm shadow-lg">
        <h2 className="w-full text-3xl font-semibold text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="w-full text-center text-sm ">
          Please {state === "Sign Up" ? "sign up" : "log in"} to book
          appointment
        </p>

        {state === "Sign Up" && (
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded border border-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-500">
            <img src={assets.person_icon} alt="" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="outline-none"
              type="text"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded border border-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-500">
          <img src={assets.mail_icon} alt="" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="bg-transparent outline-none "
            type="email"
            placeholder="Email id"
            required
          />
        </div>

        <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded border border-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-500">
          <img src={assets.lock_icon} alt="lock" />

          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className=" outline-none flex-1"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <p
          onClick={() => navigate("/reset-password")}
          className=" text-indigo-500 cursor-pointer"
        >
          Forgot Password?
        </p>

        <button
          type="submit"
          className="bg-[#5f6FFF] hover:opacity-85 cursor-pointer text-white w-full py-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
          {sending && <span className="spinner-border spinner-border-sm">...</span>}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-[#5f6FFF] underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create an new Account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-[#5f6FFF] underline cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

      </div>
    </form>
  );
};

export default Login;