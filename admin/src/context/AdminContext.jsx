import { createContext, useState, useEffect, useCallback } from "react"
import axios from "axios";
import { toast } from "react-toastify";

// Create AdminContext for global admin state
export const AdminContext = createContext();

// AdminContextProvider component: provides admin-related state and functions
const AdminContextProvider = (props) => {

   // backendUrl: Base URL for backend API
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [aiDashboardData, setAiDashboardData] = useState(false);

 

  // getAllDoctors: Fetches all doctors from backend and updates state
  const getAllDoctors = useCallback(async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message); 
    }
  }, [backendUrl, aToken]);

 // getAllPatients: Fetches all patients from backend
 const getAllPatients = useCallback(async () => {
  try {
    const { data } = await axios.get(backendUrl + "/api/admin/all-patients", {
      headers: { aToken },
    });
    if (data.success) {
      setPatients(data.patients);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message); 
  }
}, [backendUrl, aToken]);

  

  // changeAvailability: Changes availability status of a doctor
  const changeAvailability = useCallback(async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, aToken, getAllDoctors]);

  // getAllAppointments: Fetches all appointments from backend and updates state
  const getAllAppointments = useCallback(async () => {
    try {
      
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.appointments); 
      } else {
        toast.error(data.message); 
      }
    } catch (error) {
      toast.error(error.message); 
    }
  }, [backendUrl, aToken]);

  // cancelAppointment: Cancels an appointment by ID
  const cancelAppointment = useCallback(async (appointmentId) => {
    try {
     
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments(); 
      } else {
        toast.error(data.message); 
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, aToken, getAllAppointments]);

  // getDashData: Fetches dashboard data for admin
  const getDashData = useCallback(async () => {
    try {
     
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message); 
      }
    } catch (error) {
      toast.error(error.message); 
    }
  }, [backendUrl, aToken]);

  const getAiDashboardData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/ai/admin-history", {
        headers: { atoken: aToken },
      });
      if (data.success) {
        const records = data.data || [];
        const diseaseCount = records.reduce((acc, item) => {
          item.predictions?.forEach((prediction) => {
            const disease = prediction.disease;
            acc[disease] = (acc[disease] || 0) + 1;
          });
          return acc;
        }, {});

        const mostPredictedDisease = Object.entries(diseaseCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

        setAiDashboardData({
          totalPredictions: records.length,
          mostPredictedDisease,
          history: records.slice(0, 8)
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [backendUrl, aToken]);

  // add interceptor to auto-clear admin token on 401
useEffect(() => {
  const resInterceptor = axios.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response && error.response.status === 401) {
        setAToken("");
        localStorage.removeItem("aToken");
        // optional: clear doctor token as well if you want global logout
        localStorage.removeItem("dToken");
        window.location.reload();
      }
      return Promise.reject(error);
    }
  );
  return () => axios.interceptors.response.eject(resInterceptor);
}, [setAToken]);

  // value: Object containing all state and functions to provide via context
  const value = {
    aToken,
    setAToken, 
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability, 
    appointments,
    setAppointments,
    getAllAppointments, 
    cancelAppointment, 
    dashData,
    getDashData,
    patients,
    getAllPatients,
    aiDashboardData,
    getAiDashboardData
  };

 
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
