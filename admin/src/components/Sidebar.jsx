import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink } from "react-router-dom";
import {
  House,
  ClipboardClock,
  ClipboardPlus,
  Users,
} from "lucide-react";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const activeClass =
    "bg-indigo-50 dark:bg-slate-700 border-r-4 border-indigo-600 text-indigo-600";

  const normalClass =
    "hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200";

  return (
    <aside
      className="
      fixed
      top-[72px]
      left-0
      z-40
      h-[calc(100vh-72px)]
      w-18
      md:w-64
      overflow-y-auto
      bg-white
      dark:bg-[#0f172a]
      border-r
      border-gray-200
      dark:border-slate-700
      shadow-sm
    "
    >
      <div className="hidden md:block px-6 pt-6 pb-3">
        <h2 className="text-xs uppercase tracking-widest text-gray-400">
          MENU
        </h2>
      </div>

      {aToken && (
        <ul className="space-y-2 px-3">

          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 ${isActive ? activeClass : normalClass}`
            }
          >
            <House size={20} />
            <span className="hidden md:block font-medium">Dashboard</span>
          </NavLink>

          <NavLink
            to="/all-appointments"
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 ${isActive ? activeClass : normalClass}`
            }
          >
            <ClipboardClock size={20} />
            <span className="hidden md:block font-medium">Appointments</span>
          </NavLink>

          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 ${isActive ? activeClass : normalClass}`
            }
          >
            <ClipboardPlus size={20} />
            <span className="hidden md:block font-medium">Add Doctor</span>
          </NavLink>

          <NavLink
            to="/doctor-list"
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 ${isActive ? activeClass : normalClass}`
            }
          >
            <Users size={20} />
            <span className="hidden md:block font-medium">Doctors List</span>
          </NavLink>

        </ul>
      )}

      {dToken && (
        <ul className="space-y-2 px-3">

          <NavLink
            to="/doctor-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 ${isActive ? activeClass : normalClass}`
            }
          >
            <House size={20} />
            <span className="hidden md:block font-medium">Dashboard</span>
          </NavLink>

          <NavLink
            to="/doctor-appointments"
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 ${isActive ? activeClass : normalClass}`
            }
          >
            <ClipboardClock size={20} />
            <span className="hidden md:block font-medium">Appointments</span>
          </NavLink>

          <NavLink
            to="/doctor-diagnosis"
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 ${isActive ? activeClass : normalClass}`
            }
          >
            <ClipboardPlus size={20} />
            <span className="hidden md:block font-medium">AI Diagnosis</span>
          </NavLink>

          <NavLink
            to="/doctor-profile"
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 ${isActive ? activeClass : normalClass}`
            }
          >
            <Users size={20} />
            <span className="hidden md:block font-medium">Profile</span>
          </NavLink>

        </ul>
      )}
    </aside>
  );
};

export default Sidebar;