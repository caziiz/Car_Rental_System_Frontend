import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import {
  IconFileText, IconPlus, IconTrash, IconList, IconSearch,
  IconClockHour4, IconCircleCheck, IconX, IconArrowBack,
  IconCar, IconCalendar, IconCurrencyDollar,
} from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function Rentals() {
  const [rentals_data, setRentals_data] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadRentalsData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Rentals`);
      if (response.data.status) setRentals_data(response.data.data);
    } catch (error) { console.error("Error loading rentals data:", error); }
  };

  const handleReturn = async (rentalId, vehicleId) => {
    if (!window.confirm("Are you sure you want to return this vehicle?")) return;
    try {
      const response = await axios.put(`${API_URL}/Rentals/return/${rentalId}/${vehicleId}`);
      if (response.data.status) { alert("Vehicle returned successfully!"); loadRentalsData(); }
      else alert("Failed to return vehicle");
    } catch (error) { console.error(error); alert("Failed to return vehicle"); }
  };

  const handleDelete = async (rentalId) => {
    if (!window.confirm("Are you sure you want to delete this rental?")) return;
    try {
      const response = await axios.delete(`${API_URL}/Rentals/${rentalId}`);
      if (response.data.status) { alert("Rental deleted successfully!"); loadRentalsData(); }
      else alert("Failed to delete rental");
    } catch (error) { console.error(error); alert("Failed to delete rental"); }
  };

  useEffect(() => { loadRentalsData(); }, []);

  const activeRentals   = rentals_data.filter((r) => r.status === "Active").length;
  const returnedRentals = rentals_data.filter((r) => r.status === "Returned").length;
  const overdueRentals  = rentals_data.filter((r) => r.status === "Overdue").length;

  const filtered_data = rentals_data.filter((r) =>
    r.customerName.toLowerCase().includes(search.toLowerCase()) ||
    r.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
    r.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":    return "bg-blue-100 text-blue-700";
      case "Returned":  return "bg-green-100 text-green-700";
      case "Overdue":   return "bg-red-100 text-red-700";
      default:          return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-4 sm:p-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-center gap-3 text-white text-center">
            <IconFileText size={28} className="sm:size-[34px] flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">Rental Management</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Active Rentals</p><h3 className="text-3xl font-bold text-blue-600">{activeRentals}</h3></div>
              <IconClockHour4 size={40} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Returned</p><h3 className="text-3xl font-bold text-green-600">{returnedRentals}</h3></div>
              <IconCircleCheck size={40} className="text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Overdue</p><h3 className="text-3xl font-bold text-red-600">{overdueRentals}</h3></div>
              <IconX size={40} className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 sm:px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconList size={22} className="text-blue-600" />
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">Rentals List <span className="ml-2 text-sm font-normal text-gray-400 dark:text-zinc-500">({filtered_data.length})</span></h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 shadow-sm w-full sm:w-auto">
                <IconSearch size={18} className="text-gray-400 flex-shrink-0" />
                <input type="text" placeholder="Search by customer, vehicle..." className="outline-none text-sm text-gray-700 dark:text-white dark:bg-zinc-800 w-full sm:w-56" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button onClick={() => navigate("/add-rental")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow w-full sm:w-auto">
                <IconPlus size={18} /> New Rental
              </button>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                  <th className="px-5 py-4 text-left font-semibold">ID</th>
                  <th className="px-5 py-4 text-left font-semibold">Customer</th>
                  <th className="px-5 py-4 text-left font-semibold">Vehicle</th>
                  <th className="px-5 py-4 text-left font-semibold">Start Date</th>
                  <th className="px-5 py-4 text-left font-semibold">End Date</th>
                  <th className="px-5 py-4 text-left font-semibold">Daily Rate</th>
                  <th className="px-5 py-4 text-left font-semibold">Total</th>
                  <th className="px-5 py-4 text-left font-semibold">Status</th>
                  <th className="px-5 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered_data.length > 0 ? filtered_data.map((rental) => (
                  <tr key={rental.rentalId} className="border-b dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 transition">
                    <td className="px-5 py-4 dark:text-zinc-300">{rental.rentalId}</td>
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">{rental.customerName}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{rental.vehicleName}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{new Date(rental.startDate).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{new Date(rental.expectedEndDate).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">${rental.dailyRate}/day</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{rental.totalAmount ? `$${rental.totalAmount}` : "-"}</td>
                    <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(rental.status)}`}>{rental.status}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        {rental.status === "Active" && (
                          <button onClick={() => handleReturn(rental.rentalId, rental.vehicleId)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition shadow-sm" title="Return Vehicle"><IconArrowBack size={18} /></button>
                        )}
                        <button onClick={() => handleDelete(rental.rentalId)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition shadow-sm"><IconTrash size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan="9" className="text-center py-10 text-gray-500 dark:text-zinc-400">No rentals found.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="md:hidden">
            {filtered_data.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-zinc-700">
                {filtered_data.map((rental) => (
                  <div key={rental.rentalId} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{rental.customerName}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">#{rental.rentalId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(rental.status)}`}>{rental.status}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCar size={16} className="text-gray-400 flex-shrink-0" /><span>{rental.vehicleName}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCalendar size={16} className="text-gray-400 flex-shrink-0" /><span>{new Date(rental.startDate).toLocaleDateString()} → {new Date(rental.expectedEndDate).toLocaleDateString()}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCurrencyDollar size={16} className="text-gray-400 flex-shrink-0" /><span>${rental.dailyRate}/day{rental.totalAmount ? ` · Total $${rental.totalAmount}` : ""}</span></div>
                    </div>
                    <div className="flex gap-2">
                      {rental.status === "Active" && (
                        <button onClick={() => handleReturn(rental.rentalId, rental.vehicleId)} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm font-medium"><IconArrowBack size={16} />Return</button>
                      )}
                      <button onClick={() => handleDelete(rental.rentalId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm font-medium"><IconTrash size={16} />Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="text-center py-10 text-gray-500 dark:text-zinc-400">No rentals found.</div>}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Rentals;