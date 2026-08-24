import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const {
    dToken,
    appointment = [],
    getAppointment,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // fetch appointments with proper loading
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      await getAppointment();
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dToken]);

  // wrappers for actions that show loader and refetch
  const handleCancel = async (id) => {
    try {
      setLoading(true);
      await cancelAppointment(id);
      await fetchAppointments();
    } catch (err) {
      console.error("Failed to cancel appointment", err);
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      setLoading(true);
      await completeAppointment(id);
      await fetchAppointments();
    } catch (err) {
      console.error("Failed to complete appointment", err);
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

  const list = (appointment || []).slice().reverse();

  return (
    <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 ml-20 md:ml-64 w-[calc(100%-5rem)] md:w-[calc(100%-16rem)]">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-400 rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b border-gray-200 dark:border-gray-400">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {list.length === 0 ? (
          <p className="text-center py-10 text-gray-500 dark:text-gray-300">No appointments found.</p>
        ) : (
          list.map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500  dark:text-gray-400 py-3 px-6 border-b border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600"
              key={item._id || index}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full" src={item.userData?.image} alt="" />
                <p>{item.userData?.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs inline border border-[#5f6FFF] px-2 rounded-full">
                  {item.payment ? "Online" : "CASH"}
                </p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item.userData?.dob)}</p>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <p>
                {currency} {item.amount}
              </p>
              {item.cancelled ? (
                <p className="text-red-400 dark:text-red-600 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-400 dark:text-green-600 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex">
                  <img
                    onClick={() => handleCancel(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="cancel"
                  />
                  <img
                    onClick={() => handleComplete(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt="complete"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
