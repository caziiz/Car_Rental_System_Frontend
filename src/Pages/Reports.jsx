import axios from "axios";
import { useState, useEffect } from "react";
import AnimatedPage from "../components/AnimatedPage";
import {
  IconFileText,
  IconUsers,
  IconCar,
  IconCreditCard,
  IconClipboardList,
  IconPrinter,
  IconDownload,
} from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function Reports() {
  const [rentals, setRentals]     = useState([]);
  const [payments, setPayments]   = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles]   = useState([]);
  const [dateFrom, setDateFrom]   = useState("");
  const [dateTo, setDateTo]       = useState("");

  const loadData = async () => {
    try {
      const [rentalsRes, paymentsRes, customersRes, vehiclesRes] = await Promise.all([
        axios.get(`${API_URL}/Rentals`),
        axios.get(`${API_URL}/Payments`),
        axios.get(`${API_URL}/Customers`),
        axios.get(`${API_URL}/Vehicles`),
      ]);
      if (rentalsRes.data.status)   setRentals(rentalsRes.data.data);
      if (paymentsRes.data.status)  setPayments(paymentsRes.data.data);
      if (customersRes.data.status) setCustomers(customersRes.data.data);
      if (vehiclesRes.data.status)  setVehicles(vehiclesRes.data.data);
    } catch (error) {
      console.error("Error loading reports data:", error);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Filter by date range
  const filterByDate = (data, dateField) => {
    if (!dateFrom && !dateTo) return data;
    return data.filter((item) => {
      const date = new Date(item[dateField]);
      if (dateFrom && date < new Date(dateFrom)) return false;
      if (dateTo   && date > new Date(dateTo))   return false;
      return true;
    });
  };

  const filteredRentals   = filterByDate(rentals,   "startDate");
  const filteredPayments  = filterByDate(payments,  "paymentDate");
  const filteredCustomers = filterByDate(customers, "createdAt");

  const totalRevenue      = filteredPayments.filter((p) => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
  const activeRentals     = filteredRentals.filter((r) => r.status === "Active").length;
  const returnedRentals   = filteredRentals.filter((r) => r.status === "Returned").length;
  const blacklisted       = customers.filter((c) => c.isBlacklisted).length;
  const availableVehicles = vehicles.filter((v) => v.status === "Available").length;

  const exportCSV = (data, filename) => {
    if (!data.length) return alert("No data to export!");
    const headers = Object.keys(data[0]).join(",");
    const rows    = data.map((row) => Object.values(row).join(",")).join("\n");
    const blob    = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement("a");
    a.href        = url;
    a.download    = filename;
    a.click();
  };

  const handlePrint = () => window.print();

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":    case "Completed": case "Available": return "bg-green-100 text-green-700";
      case "Returned":                                      return "bg-blue-100 text-blue-700";
      case "Pending":   case "Rented":                     return "bg-yellow-100 text-yellow-700";
      case "Overdue":   case "Refunded":  case "Maintenance": return "bg-red-100 text-red-700";
      default:                                              return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-4 sm:p-6 print:bg-white print:p-0">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 mb-6 print:hidden">
          <div className="flex items-center justify-center gap-3 text-white text-center">
            <IconClipboardList size={34} />
            <h1 className="text-2xl sm:text-3xl font-bold">System Reports</h1>
          </div>
        </div>

        {/* Print Title */}
        <div className="hidden print:block text-center mb-6">
          <h1 className="text-3xl font-bold">Car Rental System — Report</h1>
          <p className="text-gray-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-end print:hidden">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">From Date</label>
            <input type="date" className="border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">To Date</label>
            <input type="date" className="border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <button onClick={() => { setDateFrom(""); setDateTo(""); }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition text-sm">
            Clear Filter
          </button>
          <div className="flex gap-2 ml-auto">
            <button onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm">
              <IconPrinter size={18} /> Print
            </button>
            <button onClick={() => exportCSV(filteredRentals, "rentals_report.csv")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm">
              <IconDownload size={18} /> Export Rentals
            </button>
            <button onClick={() => exportCSV(filteredPayments, "payments_report.csv")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm">
              <IconDownload size={18} /> Export Payments
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total Revenue",    value: `$${totalRevenue.toFixed(2)}`, color: "text-blue-600",  icon: <IconCreditCard size={32} className="text-blue-400" /> },
            { label: "Active Rentals",   value: activeRentals,                 color: "text-green-600", icon: <IconFileText size={32} className="text-green-400" /> },
            { label: "Returned Rentals", value: returnedRentals,               color: "text-indigo-600",icon: <IconFileText size={32} className="text-indigo-400" /> },
            { label: "Total Customers",  value: filteredCustomers.length,      color: "text-gray-800 dark:text-white", icon: <IconUsers size={32} className="text-purple-400" /> },
            { label: "Available Cars",   value: availableVehicles,             color: "text-green-600", icon: <IconCar size={32} className="text-green-400" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-zinc-400 text-xs">{stat.label}</p>
                  <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                </div>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Rentals Report */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconFileText size={20} className="text-blue-600" />
              <h2 className="font-semibold text-gray-800 dark:text-white">Rentals Report <span className="text-sm font-normal text-gray-400">({filteredRentals.length})</span></h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-left">Start Date</th>
                  <th className="px-4 py-3 text-left">End Date</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRentals.length > 0 ? filteredRentals.map((r) => (
                  <tr key={r.rentalId} className="border-b dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700">
                    <td className="px-4 py-3 dark:text-zinc-300">{r.rentalId}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{r.customerName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{r.vehicleName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{new Date(r.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{new Date(r.expectedEndDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{r.totalAmount ? `$${r.totalAmount}` : "-"}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(r.status)}`}>{r.status}</span></td>
                  </tr>
                )) : <tr><td colSpan="7" className="text-center py-8 text-gray-400">No rentals found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payments Report */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconCreditCard size={20} className="text-green-600" />
              <h2 className="font-semibold text-gray-800 dark:text-white">Payments Report <span className="text-sm font-normal text-gray-400">({filteredPayments.length})</span></h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Method</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? filteredPayments.map((p) => (
                  <tr key={p.paymentId} className="border-b dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700">
                    <td className="px-4 py-3 dark:text-zinc-300">{p.paymentId}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{p.customerName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{p.vehicleName}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">${p.amount}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{p.paymentMethod}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{new Date(p.paymentDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(p.status)}`}>{p.status}</span></td>
                  </tr>
                )) : <tr><td colSpan="7" className="text-center py-8 text-gray-400">No payments found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customers Report */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconUsers size={20} className="text-purple-600" />
              <h2 className="font-semibold text-gray-800 dark:text-white">Customers Report <span className="text-sm font-normal text-gray-400">({filteredCustomers.length})</span></h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">License No.</th>
                  <th className="px-4 py-3 text-left">Registered</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
                  <tr key={c.customerId} className="border-b dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700">
                    <td className="px-4 py-3 dark:text-zinc-300">{c.customerId}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{c.fullName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{c.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{c.phone}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{c.licenseNumber}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.isBlacklisted ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{c.isBlacklisted ? "Blacklisted" : "Active"}</span></td>
                  </tr>
                )) : <tr><td colSpan="7" className="text-center py-8 text-gray-400">No customers found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicles Report */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconCar size={20} className="text-orange-600" />
              <h2 className="font-semibold text-gray-800 dark:text-white">Vehicles Report <span className="text-sm font-normal text-gray-400">({vehicles.length})</span></h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Make</th>
                  <th className="px-4 py-3 text-left">Model</th>
                  <th className="px-4 py-3 text-left">Year</th>
                  <th className="px-4 py-3 text-left">License Plate</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Daily Rate</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length > 0 ? vehicles.map((v) => (
                  <tr key={v.vehicleId} className="border-b dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700">
                    <td className="px-4 py-3 dark:text-zinc-300">{v.vehicleId}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{v.make}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{v.model}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{v.year}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">{v.licensePlate}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">{v.category}</span></td>
                    <td className="px-4 py-3 text-gray-600 dark:text-zinc-300">${v.dailyRate}/day</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(v.status)}`}>{v.status}</span></td>
                  </tr>
                )) : <tr><td colSpan="8" className="text-center py-8 text-gray-400">No vehicles found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AnimatedPage>
  );
}

export default Reports;