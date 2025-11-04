import React, { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { assets } from "../assets/assets";

const MainNavbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md shadow-sm">
      {/* Logo */}
      <img
        className="w-32 sm:w-40 cursor-pointer transition-transform hover:scale-105"
        src={assets.logon}
        alt="Logo"
      />

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Optional Nav Items */}
        <p className="hidden sm:block text-gray-700 dark:text-gray-300">Welcome</p>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 
          hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 shadow-sm"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
};

export default MainNavbar;
