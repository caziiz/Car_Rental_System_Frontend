import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import {
  IconCar, IconPlus, IconEdit, IconTrash, IconList, IconSearch,
  IconCircleCheck, IconTool, IconClockHour4, IconCurrencyDollar, IconLicense,
} from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function Vehicles() {
  const [vehicles_data, setVehicles_data] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadVehiclesData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Vehicles`);
      if (response.data.status) setVehicles_data(response.data.data);
    } catch (error) { console.error("Error loading vehicles data:", error); }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const response = await axios.delete(`${API_URL}/Vehicles/${vehicleId}`);
      if (response.data.status) { alert("Vehicle deleted successfully!"); loadVehiclesData(); }
      else alert("Failed to delete vehicle");
    } catch (error) { console.error(error); alert("Failed to delete vehicle"); }
  };

  useEffect(() => { loadVehiclesData(); }, []);

  const availableVehicles   = vehicles_data.filter((v) => v.status === "Available").length;
  const rentedVehicles      = vehicles_data.filter((v) => v.status === "Rented").length;
  const maintenanceVehicles = vehicles_data.filter((v) => v.status === "Maintenance").length;

  const filtered_data = vehicles_data.filter((v) =>
    v.make.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase()) ||
    v.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-700";
      case "Rented":    return "bg-blue-100 text-blue-700";
      default:          return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-4 sm:p-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-center gap-3 text-white text-center">
            <IconCar size={28} className="sm:size-[34px] flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">Vehicle Management</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Available</p><h3 className="text-3xl font-bold text-green-600">{availableVehicles}</h3></div>
              <IconCircleCheck size={40} className="text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Rented</p><h3 className="text-3xl font-bold text-blue-600">{rentedVehicles}</h3></div>
              <IconClockHour4 size={40} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Maintenance</p><h3 className="text-3xl font-bold text-orange-600">{maintenanceVehicles}</h3></div>
              <IconTool size={40} className="text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 sm:px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconList size={22} className="text-blue-600" />
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">Vehicles List <span className="ml-2 text-sm font-normal text-gray-400 dark:text-zinc-500">({filtered_data.length})</span></h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 shadow-sm w-full sm:w-auto">
                <IconSearch size={18} className="text-gray-400 flex-shrink-0" />
                <input type="text" placeholder="Search by make, model, plate..." className="outline-none text-sm text-gray-700 dark:text-white dark:bg-zinc-800 w-full sm:w-56" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button onClick={() => navigate("/add-vehicle")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow w-full sm:w-auto">
                <IconPlus size={18} /> Add Vehicle
              </button>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                  <th className="px-5 py-4 text-left font-semibold">ID</th>
                  <th className="px-5 py-4 text-left font-semibold">Make</th>
                  <th className="px-5 py-4 text-left font-semibold">Model</th>
                  <th className="px-5 py-4 text-left font-semibold">Year</th>
                  <th className="px-5 py-4 text-left font-semibold">License Plate</th>
                  <th className="px-5 py-4 text-left font-semibold">Category</th>
                  <th className="px-5 py-4 text-left font-semibold">Daily Rate</th>
                  <th className="px-5 py-4 text-left font-semibold">Status</th>
                  <th className="px-5 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered_data.length > 0 ? filtered_data.map((vehicle) => (
                  <tr key={vehicle.vehicleId} className="border-b dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 transition">
                    <td className="px-5 py-4 dark:text-zinc-300">{vehicle.vehicleId}</td>
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">{vehicle.make}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{vehicle.model}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{vehicle.year}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{vehicle.licensePlate}</td>
                    <td className="px-5 py-4"><span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">{vehicle.category}</span></td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">${vehicle.dailyRate}/day</td>
                    <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(vehicle.status)}`}>{vehicle.status}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => navigate(`/edit-vehicle/${vehicle.vehicleId}`)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition shadow-sm"><IconEdit size={18} /></button>
                        <button onClick={() => handleDelete(vehicle.vehicleId)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition shadow-sm"><IconTrash size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan="9" className="text-center py-10 text-gray-500 dark:text-zinc-400">No vehicles found.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="md:hidden">
            {filtered_data.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-zinc-700">
                {filtered_data.map((vehicle) => (
                  <div key={vehicle.vehicleId} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{vehicle.make} {vehicle.model}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">#{vehicle.vehicleId} · {vehicle.year}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(vehicle.status)}`}>{vehicle.status}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconLicense size={16} className="text-gray-400 flex-shrink-0" /><span>{vehicle.licensePlate}</span></div>
                      <div className="flex items-center gap-2 text-sm"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">{vehicle.category}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCurrencyDollar size={16} className="text-gray-400 flex-shrink-0" /><span>${vehicle.dailyRate}/day</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/edit-vehicle/${vehicle.vehicleId}`)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm font-medium"><IconEdit size={16} />Edit</button>
                      <button onClick={() => handleDelete(vehicle.vehicleId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm font-medium"><IconTrash size={16} />Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="text-center py-10 text-gray-500 dark:text-zinc-400">No vehicles found.</div>}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Vehicles;