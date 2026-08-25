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

  const {
    token,
    setToken,
    userData,
    backendUrl,
    setUserData,
    setIsLoggedin,
  } = useContext(AppContext);

  // Handle user logout
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

  const publicNavLinks = [
    { path: "/", label: "HOME" },
    { path: "/doctors", label: "ALL DOCTORS" },
    { path: "/ai-diagnosis", label: "AI DIAGNOSIS" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
  ];

  return (
    <header className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
      {/* Logo */}
      <img
        onClick={() => {
          navigate("/");
          scrollTo(0, 0);
        }}
        className="w-44 cursor-pointer"
        src={assets.logon}
        alt="Hospitalo - Smart Hospital Management and Doctor Appointment System"
      />

      {/* Desktop Navigation */}
      <nav aria-label="Main navigation">
        <ul className="md:flex items-start gap-5 font-medium hidden">
          {publicNavLinks.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `py-1 border-b-2 transition-all duration-200 ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent hover:border-blue-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <div className="mr-0.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Logged-in User */}
        {token && userData ? (
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer group relative"
            aria-label="Open user menu"
          >
            <img
              className="w-8 rounded-full hidden md:block"
              src={userData.image}
              alt="User profile"
            />

            <img
              className="w-2.5 hidden md:block"
              src={assets.dropdown_icon}
              alt=""
            />

            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 dark:text-gray-400 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-gray-50 dark:bg-gray-800 rounded flex flex-col gap-4 p-4 shadow-md">
                <NavLink
                  to="/my-profile"
                  onClick={() => scrollTo(0, 0)}
                  className="hover:text-black dark:hover:text-white cursor-pointer"
                >
                  My Profile
                </NavLink>

                <NavLink
                  to="/my-appointments"
                  onClick={() => scrollTo(0, 0)}
                  className="hover:text-black dark:hover:text-white cursor-pointer"
                >
                  My Appointments
                </NavLink>
              </div>
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-[#4e5ee8] transition-all"
          >
            Create Account
          </button>
        )}

        {/* Logout */}
        {token && userData && (
          <button
            type="button"
            aria-label="Logout"
            title="Logout"
            className="hover:text-black text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-600 p-[2px] hover:rounded-full cursor-pointer text-2xl hidden md:block"
            onClick={logout}
          >
            <MdOutlineLogout />
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setShowMenu(true)}
          className="md:hidden"
        >
          <Menu className="w-9 h-9 cursor-pointer text-blue-600" />
        </button>

        {/* Mobile Menu Drawer */}
        <div
          className={`md:hidden ${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } right-0 top-0 bottom-0 z-60 overflow-hidden bg-white dark:bg-[#0f172a]/50 backdrop-blur-xl transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img
              src={assets.logon}
              className="w-36"
              alt="Hospitalo logo"
            />

            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setShowMenu(false)}
            >
              <X className="w-9 h-9 cursor-pointer text-blue-600" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col items-center gap-3 mt-5 px-5 text-lg font-medium">
              {publicNavLinks.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) =>
                      `w-fit px-2 text-center py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "text-blue-600 border border-blue-500 bg-blue-50"
                          : "text-gray-700 dark:text-gray-400 hover:text-blue-600 hover:border-blue-300 border border-transparent"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}

              {/* Auth buttons */}
              {token && userData ? (
                <>
                  <li>
                    <NavLink
                      onClick={() => setShowMenu(false)}
                      to="/my-profile"
                      className="w-fit px-2 text-center py-2 rounded-lg text-gray-700 dark:text-gray-400 hover:text-blue-600"
                    >
                      My Profile
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      onClick={() => setShowMenu(false)}
                      to="/my-appointments"
                      className="w-fit px-2 text-center py-2 rounded-lg text-gray-700 dark:text-gray-400 hover:text-blue-600"
                    >
                      My Appointments
                    </NavLink>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                      className="w-[30vh] text-center py-2 bg-[#5f6FFF] text-white rounded-lg font-semibold hover:opacity-80 mt-3"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      onClick={() => setShowMenu(false)}
                      to="/login"
                      className="block w-[30vh] text-center py-2 bg-[#5f6FFF] text-white rounded-lg font-semibold hover:opacity-80"
                    >
                      Login
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      onClick={() => setShowMenu(false)}
                      to="/login"
                      className="block w-[30vh] text-center py-2 bg-[#5f6FFF] text-white rounded-lg font-semibold hover:opacity-80"
                    >
                      Create Account
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;