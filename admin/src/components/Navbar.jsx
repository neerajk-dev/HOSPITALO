import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Bell,
  Search,
  LogOut,
  User,
} from "lucide-react";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const logoutHandler = () => {
    setLoading(true);

    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }

    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }

    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">

      <div className="flex items-center justify-between px-4 md:px-8 h-[72px]">

        {/* Logo */}

        <div className="flex items-center gap-3">

          <img
            src={assets.logon}
            alt="Hospitalo"
            className="w-36 cursor-pointer"
          />

          <span className="flex sm:hidden text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 dark:bg-slate-700 dark:text-white">
            {aToken ? "Admin" : "Doctor"}
          </span>

        </div>

       

        {/* Right */}

        <div className="flex items-center gap-3">

          {/* Theme */}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Profile */}

          <div className="hidden sm:flex md:flex items-center gap-2 border rounded-full px-3 py-1 dark:border-slate-700">

            <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">

              {aToken ? "A" : "D"}

            </div>

            <div>

              <p className="text-sm font-semibold dark:text-white">
                {aToken ? "Admin" : "Doctor"}
              </p>

              <p className="text-xs text-gray-500">
                {aToken ? "Administrator" : "Medical Staff"}
              </p>

            </div>

          </div>

          {/* Logout */}

          <button
            onClick={logoutHandler}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition"
          >
            <LogOut size={16} />

            {loading ? "..." : "Logout"}

          </button>

        </div>

      </div>

    </header>
  );
};

export default Navbar;