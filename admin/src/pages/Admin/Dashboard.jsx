import React, { useCallback, useContext, useEffect, useMemo, useState,
} from "react";
import { AdminContext } from "../../context/AdminContext";
import { NavLink } from "react-router-dom";
import { Activity, ArrowRight, CalendarDays, CheckCircle2, Clock3, IndianRupee, Stethoscope, TrendingUp, Users, XCircle, } from "lucide-react";
import MiniCalendar from "../../components/dashboard/MiniCalendar";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis, } from "recharts";

const Dashboard = () => {
  const { aToken, dashData, getDashData, getAiDashboardData } =
    useContext(AdminContext);
  const [loading, setLoading] = useState(true);

  const fetchDashData = useCallback(async () => {
    try {
      setLoading(true);
      await getDashData();
      await getAiDashboardData();
    } finally {
      setLoading(false);
    }
  }, [getDashData, getAiDashboardData]);

  useEffect(() => {
    if (aToken) {
      fetchDashData();
    } else {
      setLoading(false);
    }
  }, [aToken, fetchDashData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const stats = useMemo(
    () => [
      {
        title: "Total Doctors",
        value: dashData?.doctors || 0,
        icon: Stethoscope,
        accent: "from-blue-500 to-cyan-500",
        badge: "+3 this month",
      },
      {
        title: "Total Patients",
        value: dashData?.patients || 0,
        icon: Users,
        accent: "from-emerald-500 to-green-500",
        badge: "+12%",
      },
      {
        title: "Total Appointments",
        value: dashData?.appointments || 0,
        icon: CalendarDays,
        accent: "from-violet-500 to-indigo-500",
        badge: "Live",
      },
      {
        title: "Today's Appointments",
        value: dashData?.todayAppointments || 0,
        icon: Clock3,
        accent: "from-amber-500 to-orange-500",
        badge: "Today",
      },
      {
        title: "Completed",
        value: dashData?.completedAppointments || 0,
        icon: CheckCircle2,
        accent: "from-emerald-600 to-lime-500",
        badge: "Success",
      },
      {
        title: "Pending",
        value: dashData?.pendingAppointments || 0,
        icon: Activity,
        accent: "from-rose-500 to-pink-500",
        badge: "Review",
      },
      {
        title: "Cancelled",
        value: dashData?.cancelledAppointments || 0,
        icon: XCircle,
        accent: "from-slate-500 to-zinc-500",
        badge: "Needs follow-up",
      },
      {
        title: "Total Revenue",
        value: formatCurrency(dashData?.revenue || 0),
        icon: IndianRupee,
        accent: "from-fuchsia-500 to-purple-500",
        badge: "Updated now",
      },
    ],
    [dashData],
  );

  const chartData = dashData?.analytics?.appointmentsPerMonth || [];
  const revenueChartData = dashData?.analytics?.revenuePerMonth || [];

  const monthSeries = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });

    return months.map((month) => {
      const entry = chartData.find((item) => item._id?.month === month);
      return { month, count: entry?.count || 0 };
    });
  }, [chartData]);

  const revenueSeries = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });

    return months.map((month) => {
      const entry = revenueChartData.find((item) => item._id?.month === month);
      return { month, count: entry?.total || 0 };
    });
  }, [revenueChartData]);

  const currentDay = new Date().getDate();
  const currentMonth = new Date().toLocaleString("en-IN", { month: "long" });
  const dayCounts = (dashData?.latestAppointments || []).reduce((acc, item) => {
    if (item.slotDate) acc[item.slotDate] = (acc[item.slotDate] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="w-full">
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 ml-20 md:ml-64 w-[calc(100%-5rem)] md:w-[calc(100%-16rem)]">
        <div className="space-y-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#5f6FFF]">
                Hospitalo Admin Dashboard
              </p>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                Hospitalo Overview
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Monitor your hospitalo with real-time analytics and performance
                insights.
              </p>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {currentMonth} • {currentDay}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                />
              ))}
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((item) => (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition  hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div
                      className={`inline-flex rounded-2xl bg-gradient-to-r ${item.accent} p-2 text-white`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xl font-semibold text-slate-800 dark:text-slate-100">
                          {item.value}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#5f6FFF]">
                        Analytics
                      </p>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Appointments & revenue
                      </h3>
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        Appointments per month
                      </p>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthSeries}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                              dataKey="month"
                              tickFormatter={(m) => m.slice(-2)}
                            />

                            <YAxis />

                            <Tooltip />

                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="#5f6FFF"
                              strokeWidth={3}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        Revenue per month
                      </p>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueSeries}>
                            <defs>
                              <linearGradient
                                id="rev"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#10b981"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#10b981"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                              dataKey="month"
                              tickFormatter={(m) => m.slice(-2)}
                            />

                            <YAxis />

                            <Tooltip />

                            <Area
                              type="monotone"
                              dataKey="count"
                              stroke="#10b981"
                              fill="url(#rev)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-600">
                          System Status
                        </p>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          Service health
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(dashData?.systemStatus || {}).map(
                        ([label, state]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800/70"
                          >
                            <span className="capitalize text-slate-600 dark:text-slate-300">
                              {label.replace(/([A-Z])/g, " $1")}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${state === "Operational" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                            >
                              {state}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-cyan-600">
                          Quick Actions
                        </p>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          Fast tasks
                        </h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                      {[
                        { label: "Add Doctor", to: "/add-doctor" },
                        { label: "View Appointments", to: "/all-appointments" },
                        { label: "Manage Doctors", to: "/doctor-list" },
                        { label: "Manage Patients", to: "/patient-list" },
                      ].map((item) => (
                        <NavLink
                          key={item.label}
                          to={item.to}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <span>{item.label}</span>
                          <ArrowRight className="h-4 w-4" />
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_343px] gap-6 items-start">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-violet-600">
                        Recent Appointments
                      </p>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Latest bookings
                      </h3>
                    </div>
                    <NavLink
                      to="/all-appointments"
                      className="text-sm font-medium text-[#5f6FFF]"
                    >
                      View all
                    </NavLink>
                  </div>
                  <div className="overflow-x-auto overflow-y-auto max-h-[600px] rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full min-w-[760px] text-sm">
                      <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Patient</th>
                          <th className="px-4 py-3 font-semibold">Doctor</th>
                          <th className="px-4 py-3 font-semibold">
                            Department
                          </th>
                          <th className="px-4 py-3 font-semibold">Date</th>
                          <th className="px-4 py-3 font-semibold">Time</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(dashData?.latestAppointments || []).map((item) => (
                          <tr
                            key={item._id}
                            className="border-t border-slate-200/70 dark:border-slate-700/70"
                          >
                            <td className="px-4 py-3">
                              {item.patientName ||
                                item.userData?.name ||
                                "Patient"}
                            </td>
                            <td className="px-4 py-3">
                              {item.doctorName ||
                                item.docData?.name ||
                                "Doctor"}
                            </td>
                            <td className="px-4 py-3">
                              {item.department ||
                                item.docData?.speciality ||
                                "General"}
                            </td>
                            <td className="px-4 py-3">
                              {formatDate(item.slotDate)}
                            </td>
                            <td className="px-4 py-3">{item.slotTime}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.cancelled ? "bg-rose-100 text-rose-700" : item.isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                              >
                                {item.cancelled
                                  ? "Cancelled"
                                  : item.isCompleted
                                    ? "Completed"
                                    : "Pending"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button className="font-semibold text-indigo-600 hover:text-indigo-800">
                                Open →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="sticky top-24 w-full max-w-[320px] xl:max-w-none mx-auto rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                        Calendar
                      </p>

                      <h3 className="mt-1 text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                        Appointment Calendar
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        View your monthly appointment schedule.
                      </p>
                    </div>

                    <span className="self-start sm:self-auto rounded-full bg-indigo-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      Monthly
                    </span>
                  </div>

                  {/* Calendar */}
                  <div className="p-4 pt-0 sm:p-6">
                    <MiniCalendar />
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
