import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";
import { ClipboardClock, House, ClipboardPlus, Users } from 'lucide-react';

// Sidebar component for displaying navigation links based on user role (Admin/Doctor)
const Sidebar = () => {
  // Get admin token from AdminContext
  const { aToken } = useContext(AdminContext);
  // Get doctor token from DoctorContext
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="min-h-screen  bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-gray-500">
      {aToken && (
        <ul className="text-[#515151] dark:text-gray-400 mt-5">
          {/* Admin Dashboard link */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] dark:bg-gray-700 border-r-4 border-[#5f6FFF]" : ""
              }`
            }
            to={"/admin-dashboard"}
          >
            <House className="text-zinc-900 dark:text-zinc-300"/>
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          {/* Admin Appointments link */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] dark:bg-gray-700 border-r-4 border-[#5f6FFF]" : ""
              }`
            }
            to={"/all-appointments"}
          >
            {/* <img className="" src={assets.appointment_icon} alt="" /> */}
            <ClipboardClock className="text-zinc-900 dark:text-zinc-300"/>
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          {/* Add Doctor link */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] dark:bg-gray-700 border-r-4 border-[#5f6FFF]" : ""
              }`
            }
            to={"/add-doctor"}
          >
            <ClipboardPlus className="text-zinc-900 dark:text-zinc-300"/>
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          {/* Doctors List link */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] dark:bg-gray-700 border-r-4 border-[#5f6FFF]" : ""
              }`
            }
            to={"/doctor-list"}
          >
            <Users className="text-zinc-900 dark:text-zinc-300"/>
            <p className="hidden md:block">Doctors List</p>
          </NavLink>
        </ul>
      )}
      {dToken && (
        <ul className="text-[#515151] dark:text-gray-400 mt-5">
          {/* Doctor Dashboard link */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] dark:bg-gray-700 border-r-4 border-[#5f6FFF]" : ""
              }`
            }
            to={"/doctor-dashboard"}
          >
            <House className="text-zinc-900 dark:text-zinc-300"/>
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          {/* Doctor Appointments link */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] dark:bg-gray-700 border-r-4 border-[#5f6FFF]" : ""
              }`
            }
            to={"/doctor-appointments"}
          >
            <ClipboardClock className="text-zinc-900 dark:text-zinc-300"/>
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          {/* Doctor Profile link */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] dark:bg-gray-700 border-r-4 border-[#5f6FFF]" : ""
              }`
            }
            to={"/doctor-profile"}
          >
            <Users className="text-zinc-900 dark:text-zinc-300"/>
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;