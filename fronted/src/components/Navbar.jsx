import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { MdOutlineLogout } from "react-icons/md";
import { ThemeContext } from "../context/ThemeContext";
import { Menu, Moon, Sun, X } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const { token, setToken, userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

  // ✅ Handle user logout
  const logout = async () => {
    const { data } = await axios.post(backendUrl + "/api/user/logout");
    if (data.success) {
      setIsLoggedin(false);
      setUserData(false);
      localStorage.removeItem("token");
      setToken(false);
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
      {/* ✅ Logo */}
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logon}
        alt="logo"
      />

      {/* ✅ Desktop Navigation */}
      <ul className="md:flex items-start gap-5 font-medium hidden">
        {['/', '/doctors', '/ai-diagnosis', '/about', '/contact'].map((path, i) => {
          const labels = ['HOME', 'ALL DOCTORS', 'AI DIAGNOSIS', 'ABOUT', 'CONTACT'];
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `py-1 border-b-2 transition-all duration-200 ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent hover:border-blue-300"
                }`
              }
            >
              {labels[i]}
            </NavLink>
          );
        })}
      </ul>

      {/* ✅ Right Section (User / Buttons) */}
      <div className="flex items-center gap-2">
        <div className="mr-0.5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      
      
        {token && userData ? (
          <button className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full hidden md:block" src={userData.image} alt="user" />
            <img className="w-2.5 hidden md:block " src={assets.dropdown_icon} alt="dropdown" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600  dark:text-gray-400 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-gray-50 dark:bg-gray-800  rounded flex flex-col gap-4 p-4 shadow-md">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black dark:hover:text-white cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black dark:hover:text-white cursor-pointer"
                >
                  My Appointments
                </p>
              </div>
            </div>
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-[#4e5ee8] transition-all"
          >
            Create account
          </button>
        )}

        <div className="hover:text-black text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-600 p-[2px] hover:rounded-full cursor-pointer text-2xl hidden md:block" onClick={logout}>
          <MdOutlineLogout />
        </div>

        {/* ✅ Mobile Menu Toggle */}
         <Menu  onClick={() => setShowMenu(true)} className="w-9 h-9 md:hidden cursor-pointer text-blue-600 " />

        {/* ✅ Mobile Menu Drawer */}
        <div
          className={`md:hidden ${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } right-0 top-0 bottom-0 z-60 overflow-hidden bg-white dark:bg-[#0f172a]/50 backdrop-blur-xl transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logon} className="w-36" alt="logo" />
            <X onClick={() => setShowMenu(false)} className="w-9 h-9 cursor-pointer text-blue-600"/>
          </div>

          {/* ✅ Mobile Nav Links */}
          <ul className="flex flex-col items-center gap-3 mt-5 px-5 text-lg font-medium">
            {['/', '/doctors', '/ai-diagnosis', '/about', '/contact'].map((path, i) => {
              const labels = ['HOME', 'ALL DOCTORS', 'AI DIAGNOSIS', 'ABOUT', 'CONTACT'];
              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    `w-fit px-2 text-center py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-blue-600 border border-blue-500 bg-blue-50"
                        : "text-gray-700 dark:text-gray-400 hover:text-blue-600 hover:border-blue-300 border border-transparent"
                    }`
                  }
                >
                  {labels[i]}
                </NavLink>
              );
            })}

            {/* ✅ Auth buttons (mobile) */}
            {token && userData ? (
              <>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/my-profile"
                  className={({ isActive }) =>
                    `w-fit px-2 text-center py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-blue-600 border border-blue-500 bg-blue-50"
                        : "text-gray-700 dark:text-gray-400 hover:text-blue-600 hover:border-blue-300 border border-transparent"
                    }`
                  }
                >
                  My Profile
                </NavLink>

                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/my-appointments"
                  className={({ isActive }) =>
                    `w-fit px-2  text-center py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-blue-600 border border-blue-500 bg-blue-50"
                        : "text-gray-700 dark:text-gray-400 hover:text-blue-600 hover:border-blue-300 border border-transparent"
                    }`
                  }
                >
                  My Appointments
                </NavLink>

                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className=" w-[30vh] text-center py-2 bg-[#5f6FFF] text-white rounded-lg font-semibold hover:opacity-80 mt-3"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/login");
                  }}
                  to="/login"
                  className="w-[30vh] text-center py-2 bg-[#5f6FFF] text-white rounded-lg font-semibold hover:opacity-80"
                >
                  Login
                </NavLink>

                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/login"
                  className="w-[30vh]  text-center py-2 bg-[#5f6FFF] text-white rounded-lg font-semibold hover:opacity-80"
                >
                  Create account
                </NavLink>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
