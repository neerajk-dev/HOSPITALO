import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import { useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

// Navbar component for displaying the top navigation bar with logout functionality
const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const [sending, setSending] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);


  const navigate = useNavigate();

  // logoutHandler: Logs out the user by clearing tokens, localStorage, and navigating to home
  const logoutHandler = () => {
    setSending(true);
    navigate("/"); // Navigate to home page
    aToken && setAToken(""); 
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
    window.location.reload(); 
    setSending(false);
  };

  // Render the navigation bar
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-200 dark:border-gray-500 bg-white dark:bg-[#0f172a] ">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.logon}
          alt="Logo"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500  text-gray-600 dark:text-gray-300 dark:bg-gray-700">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <div className="">
          <button
            onClick={toggleTheme}
            className="p-2 mr-3 mx-2  rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={logoutHandler}
            className="bg-[#5f6FFF] hover:opacity-75 cursor-pointer text-white text-sm px-10 py-2 rounded-full"
          >
            Logout
            {sending && <span className="spinner-border spinner-border-sm">...</span>}
          </button>
      </div>
          
    </div>
  );
};

export default Navbar;