import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../Context/AuthContext";
import {
  IconFileText,
  IconDeviceFloppy,
  IconEraser,
  IconArrowLeft,
} from "@tabler/icons-react";
import api from "./api";  // same folder

function AddRental() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ← logged in user

  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles]   = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId]   = useState("");
  const [startDate, setStartDate]   = useState("");
  const [endDate, setEndDate]       = useState("");
  const [dailyRate, setDailyRate]   = useState("");
  const [notes, setNotes]           = useState("");

  const totalDays = startDate && endDate
    ? Math.max((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24), 1)
    : 0;

  const totalAmount = totalDays * (parseFloat(dailyRate) || 0);

const loadDropdowns = async () => {
  try {
    const [customersRes, vehiclesRes] = await Promise.all([
      api.get(`/Customers`),
      api.get(`/Vehicles`),
    ]);
    if (customersRes.data.status) setCustomers(
  customersRes.data.data.filter((c) => !c.isBlacklisted)
);
    if (vehiclesRes.data.status) setVehicles(
      vehiclesRes.data.data.filter((v) => v.status === "Available")
    );
  } catch (error) {
    console.error("Error loading dropdowns:", error);
  }
};

  const handleVehicleChange = (e) => {
    const selectedId = e.target.value;
    setVehicleId(selectedId);
    const selectedVehicle = vehicles.find((v) => v.vehicleId === Number(selectedId));
    if (selectedVehicle) setDailyRate(selectedVehicle.dailyRate);
  };

  useEffect(() => { loadDropdowns(); }, []);

  const validateInputs = () => {
    if (!customerId) { alert("Please select a customer");   return false; }
    if (!vehicleId)  { alert("Please select a vehicle");    return false; }
    if (!startDate)  { alert("Please enter start date");    return false; }
    if (!endDate)    { alert("Please enter end date");      return false; }
    if (new Date(endDate) <= new Date(startDate)) { alert("End date must be after start date"); return false; }
    return true;
  };

  const clearData = () => {
    setCustomerId("");
    setVehicleId("");
    setStartDate("");
    setEndDate("");
    setDailyRate("");
    setNotes("");
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    try {
      const rental = {
        customerId:      Number(customerId),
        vehicleId:       Number(vehicleId),
        userId:          user.userId, // ← logged in user automatically
        startDate:       startDate,
        expectedEndDate: endDate,
        dailyRate:       parseFloat(dailyRate),
        notes,
        status:          "Active",
        createdAt:       new Date().toISOString(),
      };

      const response = await api.post(`/Rentals`, rental);
      if (response.data.status) {
        alert("Rental created successfully!");
        navigate("/rentals");
      } else {
        alert("Failed to create rental: " + response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 transition-colors duration-300">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-center gap-3 text-white text-center">
            <IconFileText size={28} className="sm:size-[34px]" />
            <h1 className="text-2xl sm:text-3xl font-bold">New Rental</h1>
          </div>
        </div>

        {/* Logged in user info */}
        <div className="max-w-2xl mx-auto mb-4 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-600 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.fullName?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400">{user?.role} — creating this rental</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg max-w-2xl mx-auto transition-colors">
          <div className="bg-slate-50 dark:bg-slate-700 px-5 sm:px-6 py-4 border-b rounded-t-2xl font-semibold text-gray-800 dark:text-gray-100 border-slate-200 dark:border-slate-600">
            Enter Rental Details
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Customer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Customer</label>
              <select className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="">Select customer...</option>
                {customers.map((c) => (
                  <option key={c.customerId} value={c.customerId}>{c.fullName}</option>
                ))}
              </select>
            </div>

            {/* Vehicle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Vehicle <span className="text-green-600 text-xs">(Available only)</span>
              </label>
              <select className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={vehicleId} onChange={handleVehicleChange}>
                <option value="">Select vehicle...</option>
                {vehicles.map((v) => (
                  <option key={v.vehicleId} value={v.vehicleId}>{v.make} {v.model} ({v.year}) - ${v.dailyRate}/day</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Start Date</label>
              <input type="date" className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Expected End Date</label>
              <input type="date" className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            {/* Daily Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Daily Rate ($)</label>
              <input type="number" readOnly className="w-full border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2"
                value={dailyRate} />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Notes <span className="text-gray-400 text-xs">(optional)</span></label>
              <input type="text" className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2"
                placeholder="Any notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            {/* Summary */}
            {totalDays > 0 && (
              <div className="md:col-span-2 bg-blue-50 dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl p-4">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Rental Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Total Days</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalDays}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Daily Rate</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">${dailyRate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-700 rounded-b-2xl flex flex-col sm:flex-row sm:justify-between gap-3">
            <button onClick={() => navigate("/rentals")} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto">
              <IconArrowLeft size={18} /> Back
            </button>
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={clearData} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                <IconEraser size={18} /> Clear
              </button>
              <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                <IconDeviceFloppy size={18} /> Create Rental
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default AddRental;