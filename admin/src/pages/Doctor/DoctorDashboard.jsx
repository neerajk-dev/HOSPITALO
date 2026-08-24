import React, { useContext, useEffect, useMemo, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import {
  Activity,
  BellRing,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Stethoscope,
  TrendingUp,
  Users,
  LoaderCircle
} from "lucide-react";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (dToken) {
        setLoading(true);
        await getDashData();
        setLoading(false);
      }
    };
    fetchData();
  }, [dToken, getDashData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const stats = useMemo(() => [
    { title: "Today's Appointments", value: dashData?.todayAppointments || 0, icon: CalendarDays, accent: "from-blue-500 to-cyan-500" },
    { title: "Upcoming Appointments", value: dashData?.upcomingAppointments || 0, icon: Clock3, accent: "from-violet-500 to-indigo-500" },
    { title: "Completed Today", value: dashData?.completedToday || 0, icon: CheckCircle2, accent: "from-emerald-500 to-green-500" },
    { title: "Pending Patients", value: dashData?.pendingPatients || 0, icon: Activity, accent: "from-rose-500 to-pink-500" },
    { title: "Revenue", value: formatCurrency(dashData?.earnings || 0), icon: TrendingUp, accent: "from-amber-500 to-orange-500" },
    { title: "Patients Seen", value: dashData?.patients || 0, icon: Users, accent: "from-fuchsia-500 to-purple-500" }
  ], [dashData]);

  return (
    <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 ml-20 md:ml-64 w-[calc(100%-5rem)] md:w-[calc(100%-16rem)]">
      <div className="mb-5">
        <p className="text-sm font-medium text-[#5f6FFF]">Doctor Workspace</p>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Daily care overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Appointments, patient follow-ups, and visit activity from your database.</p>
      </div>

      {loading ? (
        <div className="flex h-[75vh] items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <LoaderCircle
                className="h-16 w-16 animate-spin text-[#5f6FFF]"
                strokeWidth={1.5}
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-700">
              Loading Dashboard
            </h3>

            <p className="mt-1 text-sm text-slate-500 animate-pulse">
              Fetching latest appointments...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <div className={`inline-flex rounded-2xl bg-gradient-to-r ${item.accent} p-2 text-white`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
                <p className="mt-1 text-xl font-semibold text-slate-800 dark:text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              {dashData?.todaySchedule?.length ? (
                <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-600">Today's Schedule</p>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Upcoming visits</h3>
                </div>
              </div>
              ) : (
                <p className="text-center py-10 text-slate-400">
                    No appointments today
                </p>
              )}
              <div className="space-y-3">
                {(dashData?.todaySchedule || []).map((item) => (
                  <div key={item._id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <div className="rounded-2xl bg-[#5f6FFF]/10 p-2 text-[#5f6FFF]"><Clock3 className="h-4 w-4" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.userData?.name || "Patient"}</p>
                      <p className="text-xs text-slate-500">{item.slotTime} • {formatDate(item.slotDate)}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.cancelled ? "bg-rose-100 text-rose-700" : item.isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {item.cancelled ? "Cancelled" : item.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Prescription Shortcut</p>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Quick actions</h3>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Generate Prescription", icon: Stethoscope },
                  { label: "Upload Medical Report", icon: FileText },
                  { label: "View Patient History", icon: Users }
                ].map((item) => (
                  <button key={item.label} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-2"><item.icon className="h-4 w-4" /> {item.label}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Recent Patients</p>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Patient history</h3>
                </div>
              </div>
              <div className="space-y-3">
                {(dashData?.recentPatients || []).map((patient) => (
                  <div key={patient._id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <img src={patient.image || assets.people_icon} alt={patient.name} className="h-10 w-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{patient.name}</p>
                      <p className="text-xs text-slate-500">{patient.gender || "Not specified"} • {patient.phone || "—"}</p>
                    </div>
                    <span className="text-xs text-slate-500">{formatDate(patient.date)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Latest Notifications</p>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Updates</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {(dashData?.notifications || []).map((item, index) => (
                    <div key={`${item.title}-${index}`} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                      <div className="rounded-2xl bg-[#5f6FFF]/10 p-2 text-[#5f6FFF]"><BellRing className="h-4 w-4" /></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-fuchsia-600">Performance Summary</p>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">This month</h3>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70"><span>Appointments</span><span className="font-semibold">{dashData?.appointments || 0}</span></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70"><span>Completed</span><span className="font-semibold">{dashData?.completedToday || 0}</span></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70"><span>Revenue</span><span className="font-semibold">{formatCurrency(dashData?.earnings || 0)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorDashboard;
