import axios from "axios";
import { useState, useEffect } from "react";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../Context/AuthContext";
import {
  IconUsers,
  IconCar,
  IconCircleCheck,
  IconTool,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [users, setUsers]             = useState([]);
  const [vehicles, setVehicles]       = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [payments, setPayments]       = useState([]);

  const loadData = async () => {
    try {
      const [usersRes, vehiclesRes, revenueRes, paymentsRes] = await Promise.all([
        axios.get(`${API_URL}/Users`),
        axios.get(`${API_URL}/Vehicles`),
        axios.get(`${API_URL}/Payments/revenue`),
        axios.get(`${API_URL}/Payments`),
      ]);

      if (usersRes.data.status)    setUsers(usersRes.data.data);
      if (vehiclesRes.data.status) setVehicles(vehiclesRes.data.data);
      if (revenueRes.data.status)  setTotalRevenue(revenueRes.data.data);
      if (paymentsRes.data.status) setPayments(paymentsRes.data.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const availableVehicles   = vehicles.filter((v) => v.status === "Available").length;
  const rentedVehicles      = vehicles.filter((v) => v.status === "Rented").length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === "Maintenance").length;

  const pieData = [
    { name: "Available",   value: availableVehicles,   color: "#16a34a" },
    { name: "Rented",      value: rentedVehicles,      color: "#2563eb" },
    { name: "Maintenance", value: maintenanceVehicles, color: "#ea580c" },
  ];

  // Dynamic bar chart from real payments data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const barData = months.map((month, index) => ({
    month,
    revenue: payments
      .filter((p) => p.status === "Completed" && new Date(p.paymentDate).getMonth() === index)
      .reduce((sum, p) => sum + p.amount, 0)
  })).filter((d) => d.revenue > 0); // only show months with data

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-6">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white">
            <p className="text-blue-200 text-sm">Welcome back, {user?.fullName || user?.email || "User"} 👋</p>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-blue-100 text-sm">Role: {user?.role || "Staff"}</p>
          </div>
          <p className="text-blue-200 text-sm">June 2026</p>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 ${isAdmin ? "md:grid-cols-5" : "md:grid-cols-2"} gap-4 mb-6`}>
          {isAdmin && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm">Total Users</p>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{users.length}</h3>
                </div>
                <IconUsers size={40} className="text-blue-500" />
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-blue-600">${totalRevenue}</h3>
                </div>
                <IconCurrencyDollar size={40} className="text-blue-500" />
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">Total Vehicles</p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{vehicles.length}</h3>
              </div>
              <IconCar size={40} className="text-indigo-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">Available</p>
                <h3 className="text-3xl font-bold text-green-600">{availableVehicles}</h3>
              </div>
              <IconCircleCheck size={40} className="text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">Maintenance</p>
                <h3 className="text-3xl font-bold text-orange-600">{maintenanceVehicles}</h3>
              </div>
              <IconTool size={40} className="text-orange-500" />
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Bar Chart - Live Monthly Revenue */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Monthly Revenue
                <span className="ml-2 text-xs font-normal text-green-500">● Live</span>
              </h2>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 13 }} />
                    <YAxis tick={{ fontSize: 13 }} />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Revenue"]}
                      contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", color: "#fff", borderRadius: 8 }}
                    />
                    <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400 dark:text-zinc-500">
                  No payment data yet
                </div>
              )}
            </div>

            {/* Pie Chart - Vehicle Status */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Vehicle Status</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", color: "#fff", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Staff only sees vehicle status */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Vehicle Status</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", color: "#fff", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 flex flex-col justify-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Staff View</h2>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                As a staff member you can manage Vehicles, Customers, Rentals and Payments from the sidebar.
              </p>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}

export default Dashboard;