import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import {
  IconUsers,
  IconDeviceFloppy,
  IconEraser,
  IconArrowLeft,
} from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function AddEditCustomer() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const isEditing = !!customerId;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [address, setAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isBlacklisted, setIsBlacklisted] = useState(false);

  const validateInputs = () => {
    if (!fullName.trim()) return alert("Please enter full name"), false;
    if (!email.trim()) return alert("Please enter email"), false;
    if (!phone.trim()) return alert("Please enter phone"), false;
    if (!nationalId.trim()) return alert("Please enter national ID"), false;
    if (!address.trim()) return alert("Please enter address"), false;
    if (!licenseNumber.trim()) return alert("Please enter license number"), false;
    return true;
  };

  const clearData = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setNationalId("");
    setAddress("");
    setLicenseNumber("");
    setIsBlacklisted(false);
  };

  const loadCustomer = async () => {
    try {
      const response = await axios.get(`${API_URL}/Customers/${customerId}`);
      const result = response.data;

      if (result.status) {
        const c = result.data[0];
        setFullName(c.fullName);
        setEmail(c.email);
        setPhone(c.phone);
        setNationalId(c.nationalId);
        setAddress(c.address);
        setLicenseNumber(c.licenseNumber);
        setIsBlacklisted(c.isBlacklisted);
      }
    } catch (error) {
      console.error("Error loading customer:", error);
    }
  };

  useEffect(() => {
    if (isEditing) loadCustomer();
  }, [isEditing, customerId]);

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      const customer = {
        customerId: isEditing ? Number(customerId) : 0,
        fullName,
        email,
        phone,
        nationalId,
        address,
        licenseNumber,
        isBlacklisted,
        createdAt: new Date().toISOString(),
      };

      if (isEditing) {
      const response = await axios.put(
  `${API_URL}/Customers`,
  customer
);

        if (response.data.status) {
          alert("Customer updated successfully!");
          navigate("/customers");
        } else {
          alert("Failed to update customer");
        }
      } else {
        const response = await axios.post(`${API_URL}/Customers`, customer);

        if (response.data.status) {
          alert("Customer added successfully!");
          navigate("/customers");
        } else {
          alert("Failed to add customer");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 flex flex-col items-center transition-colors duration-300">

        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
            <div className="flex items-center justify-center gap-3 text-white text-center">
              <IconUsers size={28} className="sm:size-[34px]" />
              <h1 className="text-2xl sm:text-3xl font-bold">
                {isEditing ? "Edit Customer" : "Add New Customer"}
              </h1>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">

            {/* Title */}
            <div className="bg-slate-50 dark:bg-slate-700 px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-600">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                {isEditing ? "Update Customer Details" : "Enter Customer Details"}
              </h2>
            </div>

            {/* Form */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Full Name
                </label>
                <input
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Email
                </label>
                <input
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Phone
                </label>
                <input
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* National ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  National ID
                </label>
                <input
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Address
                </label>
                <input
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* License */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  License Number
                </label>
                <input
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </div>

              {/* Blacklist */}
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  checked={isBlacklisted}
                  onChange={(e) => setIsBlacklisted(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="ml-2 text-sm text-red-600 dark:text-red-400 font-medium">
                  Blacklisted
                </span>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-100 dark:border-slate-600 flex flex-col sm:flex-row justify-between gap-3">

              <button
                onClick={() => navigate("/customers")}
                className="bg-slate-500 hover:bg-slate-600 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition font-medium"
              >
                <IconArrowLeft size={18} />
                Back
              </button>

              <div className="flex gap-3">

                <button
                  onClick={clearData}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition font-medium"
                >
                  <IconEraser size={18} />
                  Clear
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition font-medium"
                >
                  <IconDeviceFloppy size={18} />
                  {isEditing ? "Update" : "Save"}
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default AddEditCustomer;