import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import {
  IconCar,
  IconDeviceFloppy,
  IconEraser,
  IconArrowLeft,
} from "@tabler/icons-react";

function AddEditVehicle() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const isEditing = !!vehicleId;

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [category, setCategory] = useState("Economy");
  const [dailyRate, setDailyRate] = useState("");
  const [status, setStatus] = useState("Available");
  const [mileage, setMileage] = useState("");

  const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

  const validateInputs = () => {
    if (!make.trim()) return alert("Please enter make"), false;
    if (!model.trim()) return alert("Please enter model"), false;
    if (!year) return alert("Please enter year"), false;
    if (!licensePlate.trim()) return alert("Please enter license plate"), false;
    if (!dailyRate) return alert("Please enter daily rate"), false;
    if (!mileage) return alert("Please enter mileage"), false;
    return true;
  };

  const clearData = () => {
    setMake("");
    setModel("");
    setYear("");
    setLicensePlate("");
    setCategory("Economy");
    setDailyRate("");
    setStatus("Available");
    setMileage("");
  };

  const loadVehicle = async () => {
    try {
      const response = await axios.get(`${API_URL}/Vehicles/${vehicleId}`);
      const result = response.data;
      if (result.status) {
        const v = result.data[0];
        setMake(v.make);
        setModel(v.model);
        setYear(v.year);
        setLicensePlate(v.licensePlate);
        setCategory(v.category);
        setDailyRate(v.dailyRate);
        setStatus(v.status);
        setMileage(v.mileage);
      }
    } catch (error) {
      console.error("Error loading vehicle:", error);
    }
  };

  useEffect(() => {
    if (isEditing) loadVehicle();
  }, []);

const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      const baseVehicle = {
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        licensePlate: licensePlate.trim(),
        category,
        dailyRate: Number(dailyRate),
        status,
        mileage: Number(mileage),
      };

      if (isEditing) {
        const response = await axios.put(`${API_URL}/Vehicles`, {
          ...baseVehicle,
          vehicleId: Number(vehicleId),
        });
        if (response.data.status) {
          alert("Vehicle updated successfully!");
          navigate("/vehicles");
        } else {
          alert("Failed to update vehicle");
        }
      } else {
        const response = await axios.post(`${API_URL}/Vehicles`, baseVehicle);
        if (response.data.status) {
          alert("Vehicle added successfully!");
          navigate("/vehicles");
        } else {
          alert("Failed to add vehicle");
        }
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
            <IconCar size={28} className="sm:size-[34px] flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg max-w-2xl mx-auto transition-colors">

          <div className="bg-slate-50 dark:bg-slate-700 px-5 sm:px-6 py-4 border-b rounded-t-2xl font-semibold text-gray-800 dark:text-gray-100 border-slate-200 dark:border-slate-600">
            {isEditing ? "Update Vehicle Details" : "Enter Vehicle Details"}
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Make */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Make
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Model
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Year
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            {/* License Plate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                License Plate
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Category
              </label>
              <select
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Economy</option>
                <option>Standard</option>
                <option>SUV</option>
                <option>Luxury</option>
                <option>Van</option>
              </select>
            </div>

            {/* Daily Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Daily Rate ($)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Available</option>
                <option>Rented</option>
                <option>Maintenance</option>
              </select>
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Mileage (km)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-700 rounded-b-2xl flex flex-col sm:flex-row sm:justify-between gap-3">

            <button
              onClick={() => navigate("/vehicles")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <IconArrowLeft size={18} />
              Back
            </button>

            <div className="flex flex-col sm:flex-row gap-2">

              <button
                onClick={clearData}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <IconEraser size={18} />
                Clear
              </button>

              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <IconDeviceFloppy size={18} />
                {isEditing ? "Update Vehicle" : "Save Vehicle"}
              </button>

            </div>
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
}

export default AddEditVehicle;