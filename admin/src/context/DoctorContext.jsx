import { useState, useEffect, useCallback } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") || ""
  );
  const [appointment, setAppointment] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // Fetch all appointments
  const getAppointment = useCallback(async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        { headers: { dToken } }
      );
      if (data.success) {
        setAppointment(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, dToken]);

  // Mark appointment as completed
  const completeAppointment = useCallback(async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, dToken, getAppointment]);

  // Cancel appointment
  const cancelAppointment = useCallback(async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, dToken, getAppointment]);

  // Fetch dashboard data
  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/dashboard",
        { headers: { dToken } }
      );
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, dToken]);

  // Fetch profile data
  const getProfileData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/profile",
        { headers: { dToken } }
      );
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, dToken]);

  // add interceptor to auto-clear doctor token on 401
  useEffect(() => {
  const resInterceptor = axios.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response && error.response.status === 401) {
        setDToken("");
        localStorage.removeItem("dToken");
        // optional: clear admin token too if needed
        // localStorage.removeItem("aToken");
        window.location.reload();
      }
      return Promise.reject(error);
    }
  );
  return () => axios.interceptors.response.eject(resInterceptor);
  }, [setDToken]);

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointment,
    setAppointment,
    getAppointment,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;