import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import ActionButtons from "../components/Actionbuttons";
import PageHeader from "../components/Pageheader";
import StatCard from "../components/StatCard";
import AddButton from "../components/Addbutton";
import Badge from "../components/Badge";
import ConfirmModal from "../components/ConfirmModal";
import SearchInput from "../components/SearchInput";
import {
  IconFileText, IconList,
  IconClockHour4, IconCircleCheck, IconX, IconArrowBack,
  IconCar, IconCalendar, IconCurrencyDollar,
} from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function Rentals() {
  const [rentals_data, setRentals_data] = useState([]);
  const [search, setSearch]             = useState("");
  const [confirmId, setConfirmId]       = useState(null); // rentalId pending delete
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

  const confirmDelete = async () => {
    const rentalId = confirmId;
    setConfirmId(null);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":   return "blue";
      case "Returned": return "green";
      case "Overdue":  return "red";
      default:         return "gray";
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-4 sm:p-6">

        {/* Header */}
        <PageHeader title="Rental Management" icon={IconFileText} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Active Rentals" value={activeRentals}   icon={IconClockHour4}  iconColor="text-blue-500"  valueColor="text-blue-600" />
          <StatCard label="Returned"       value={returnedRentals} icon={IconCircleCheck} iconColor="text-green-500" valueColor="text-green-600" />
          <StatCard label="Overdue"        value={overdueRentals}  icon={IconX}           iconColor="text-red-500"   valueColor="text-red-600" />
        </div>

        {/* Rentals Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 sm:px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconList size={22} className="text-blue-600" />
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                Rentals List <span className="ml-2 text-sm font-normal text-gray-400 dark:text-zinc-500">({filtered_data.length})</span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search by customer, vehicle..." />
              <AddButton label="New Rental" to="/add-rental" />
            </div>
          </div>

          {/* Desktop Table */}
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
                    <td className="px-5 py-4">
                      <Badge label={rental.status} color={getStatusColor(rental.status)} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center items-center gap-2">
                        {rental.status === "Active" && (
                          <button onClick={() => handleReturn(rental.rentalId, rental.vehicleId)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition shadow-sm" title="Return Vehicle">
                            <IconArrowBack size={18} />
                          </button>
                        )}
                        <ActionButtons
                          onDelete={() => setConfirmId(rental.rentalId)}
                          showDelete={true}
                          showEdit={false}
                        />
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan="9" className="text-center py-10 text-gray-500 dark:text-zinc-400">No rentals found.</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
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
                      <Badge label={rental.status} color={getStatusColor(rental.status)} />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCar size={16} className="text-gray-400 flex-shrink-0" /><span>{rental.vehicleName}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCalendar size={16} className="text-gray-400 flex-shrink-0" /><span>{new Date(rental.startDate).toLocaleDateString()} → {new Date(rental.expectedEndDate).toLocaleDateString()}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCurrencyDollar size={16} className="text-gray-400 flex-shrink-0" /><span>${rental.dailyRate}/day{rental.totalAmount ? ` · Total $${rental.totalAmount}` : ""}</span></div>
                    </div>
                    <div className="flex gap-2">
                      {rental.status === "Active" && (
                        <button onClick={() => handleReturn(rental.rentalId, rental.vehicleId)} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm font-medium">
                          <IconArrowBack size={16} />Return
                        </button>
                      )}
                      <ActionButtons
                        onDelete={() => setConfirmId(rental.rentalId)}
                        showEdit={false}
                        showDelete={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="text-center py-10 text-gray-500 dark:text-zinc-400">No rentals found.</div>}
          </div>

        </div>

        <ConfirmModal
          isOpen={confirmId !== null}
          title="Delete Rental"
          message="Are you sure you want to delete this rental? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      </div>
    </AnimatedPage>
  );
}

export default Rentals;