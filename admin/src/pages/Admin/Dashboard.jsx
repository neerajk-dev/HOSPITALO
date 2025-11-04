import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { TbListDetails } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const { aToken, cancelAppointment, dashData, getDashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // fetch dashboard data with loading state
  const fetchDashData = async () => {
    try {
      setLoading(true);
      // getDashData is assumed to update dashData in context
      await getDashData();
    } catch (err) {
      // optional: console.error(err) or show toast
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchDashData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aToken]);

  // wrapper for cancelling appointment that shows loader and refetches data
  const handleCancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      await cancelAppointment(appointmentId);
      // refetch dashboard after successful cancel
      await fetchDashData();
    } catch (err) {
      console.error("Failed to cancel appointment", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <span className="w-12 h-12 my-1 rounded-full border-3 border-[#5f6FFF] border-t-transparent animate-spin"></span>
      </div>
    );
  }

  // when not loading
  return (
    dashData && (
      <div className="m-5 ">
        {/* Stat Cards */}
        <div className="flex flex-wrap gap-3 ">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-700  p-4 min-w-52 rounded border-2 border-gray-100 dark:border-gray-400 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600 dark:text-gray-200">{dashData.doctors}</p>
              <p className="text-gray-400">Doctors</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-gray-700 p-4 min-w-52 rounded border-2 border-gray-100 dark:border-gray-400  cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600 dark:text-gray-200">{dashData.appointments}</p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-gray-700 p-4 min-w-52 rounded border-2 border-gray-100 dark:border-gray-400  cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600 dark:text-gray-200">{dashData.patients}</p>
              <p className="text-gray-400">Patients</p>
            </div>
            <NavLink
              className="ml-2 p-2 rounded-md bg-gray-100 dark:bg-gray-400 text-center cursor-pointer hover:scale-110 transition-all"
              to={"/user-list"}
            >
              <TbListDetails className="text-2xl text-gray-600 dark:text-gray-900" />
            </NavLink>
          </div>
        </div>

        {/* Latest Appointments */}
        <div className="bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-200">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Booking</p>
          </div>

          <div className="pt-4 border border-gray-200 border-t-0">
            {(dashData.latestAppointments || []).map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 dark:hover:bg-gray-600"
                key={item._id || index}
              >
                <img className="rounded-full w-10" src={item.docData.image} alt="" />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 dark:text-gray-300 font-medium">{item.docData.name}</p>
                  <p className="text-gray-600 dark:text-gray-400">{slotDateFormat(item.slotDate)}</p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">Completed</p>
                ) : (
                  <img
                    onClick={() => handleCancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="cancel"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
