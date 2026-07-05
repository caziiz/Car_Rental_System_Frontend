import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import StatCard from "../components/StatCard";
import PageHeader from "../components/Pageheader";
import ActionButtons from "../components/Actionbuttons";
import AddButton from "../components/Addbutton";
import Badge from "../components/Badge";
import ConfirmModal from "../components/ConfirmModal";
import SearchInput from "../components/SearchInput";
import {
  IconCar, IconList,
  IconCircleCheck, IconTool, IconClockHour4, IconCurrencyDollar, IconLicense,
} from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function Vehicles() {
  const [vehicles_data, setVehicles_data] = useState([]);
  const [search, setSearch]               = useState("");
  const [confirmId, setConfirmId]         = useState(null); // vehicleId pending delete
  const navigate = useNavigate();

  const loadVehiclesData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Vehicles`);
      if (response.data.status) setVehicles_data(response.data.data);
    } catch (error) { console.error("Error loading vehicles data:", error); }
  };

  const confirmDelete = async () => {
    const vehicleId = confirmId;
    setConfirmId(null);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Available": return "green";
      case "Rented":    return "blue";
      default:          return "orange"; // Maintenance
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-4 sm:p-6">

        {/* Header */}
        <PageHeader title="Vehicle Management" icon={IconCar} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Available Vehicles"   value={availableVehicles}   icon={IconCircleCheck} iconColor="text-green-500" valueColor="text-green-600" />
          <StatCard label="Rented Vehicles"      value={rentedVehicles}      icon={IconClockHour4}  iconColor="text-blue-500"  valueColor="text-blue-600" />
          <StatCard label="Maintenance Vehicles" value={maintenanceVehicles} icon={IconTool}         iconColor="text-red-500"   valueColor="text-red-600" />
        </div>

        {/* Vehicles Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 sm:px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconList size={22} className="text-blue-600" />
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                Vehicles List <span className="ml-2 text-sm font-normal text-gray-400 dark:text-zinc-500">({filtered_data.length})</span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search by make, model, plate..." />
              <AddButton label="Add Vehicle" to="/add-vehicle" />
            </div>
          </div>

          {/* Desktop Table */}
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
                    <td className="px-5 py-4"><Badge label={vehicle.category} color="indigo" /></td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">${vehicle.dailyRate}/day</td>
                    <td className="px-5 py-4"><Badge label={vehicle.status} color={getStatusColor(vehicle.status)} /></td>
                    <td className="px-5 py-4">
                      <ActionButtons
                        onEdit={() => navigate(`/edit-vehicle/${vehicle.vehicleId}`)}
                        onDelete={() => setConfirmId(vehicle.vehicleId)}
                      />
                    </td>
                  </tr>
                )) : <tr><td colSpan="9" className="text-center py-10 text-gray-500 dark:text-zinc-400">No vehicles found.</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
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
                      <Badge label={vehicle.status} color={getStatusColor(vehicle.status)} />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconLicense size={16} className="text-gray-400 flex-shrink-0" /><span>{vehicle.licensePlate}</span></div>
                      <div className="flex items-center gap-2 text-sm"><Badge label={vehicle.category} color="indigo" /></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCurrencyDollar size={16} className="text-gray-400 flex-shrink-0" /><span>${vehicle.dailyRate}/day</span></div>
                    </div>
                    <ActionButtons
                      onEdit={() => navigate(`/edit-vehicle/${vehicle.vehicleId}`)}
                      onDelete={() => setConfirmId(vehicle.vehicleId)}
                    />
                  </div>
                ))}
              </div>
            ) : <div className="text-center py-10 text-gray-500 dark:text-zinc-400">No vehicles found.</div>}
          </div>

        </div>

        <ConfirmModal
          isOpen={confirmId !== null}
          title="Delete Vehicle"
          message="Are you sure you want to delete this vehicle? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      </div>
    </AnimatedPage>
  );
}

export default Vehicles;