import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../Context/AuthContext";
import {
  IconUserPlus,
  IconUserEdit,
  IconDeviceFloppy,
  IconEraser,
  IconArrowLeft,
} from "@tabler/icons-react";
import api from "./api";  // same folder
function AddEditUser() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const isEditing = !!userId;
  const isEditingSelf = isEditing && Number(userId) === currentUser?.userId;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [role, setRole] = useState("Staff");
  const [isActive, setIsActive] = useState(true);

  const validateInputs = () => {
    if (!fullName.trim()) {
      alert("Please enter full name");
      return false;
    }
    if (!email.trim()) {
      alert("Please enter email");
      return false;
    }
    if (!isEditing && !passwordHash.trim()) {
      alert("Please enter password");
      return false;
    }
    return true;
  };

  const clearData = () => {
    setFullName("");
    setEmail("");
    setPasswordHash("");
    setRole("Staff");
    setIsActive(true);
  };

  const loadUser = async () => {
    try {
      const response = await api.get(`/Users/${userId}`);
      const result = response.data;
      if (result.status) {
        const user = result.data[0];
        setFullName(user.fullName);
        setEmail(user.email);
        setRole(user.role);
        setIsActive(user.isActive);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  useEffect(() => {
    if (isEditing) loadUser();
  }, []);

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      const user = {
        userId: isEditing ? Number(userId) : 0,
        fullName,
        email,
        passwordHash: passwordHash || "UNCHANGED",
        role,
        isActive,
        createdAt: new Date().toISOString(),
      };

      if (isEditing) {
        const response = await api.put(`/Users/${userId}`, user);
        if (response.data.status) {
          alert("User updated successfully!");
          navigate("/users");
        } else {
          alert("Failed to update user");
        }
      } else {
        const response = await api.post(`/Users`, user);
        if (response.data.status) {
          alert("User added successfully!");
          navigate("/users");
        } else {
          alert("Failed to add user");
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
              {isEditing ? (
                <IconUserEdit size={28} className="sm:size-[34px] flex-shrink-0" />
              ) : (
                <IconUserPlus size={28} className="sm:size-[34px] flex-shrink-0" />
              )}
              <h1 className="text-2xl sm:text-3xl font-bold">
                {isEditing ? "Edit User Profile" : "Add New User"}
              </h1>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">

            <div className="bg-slate-50 dark:bg-slate-700 px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-600">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                {isEditing ? "Update User Details" : "Enter User Details"}
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-5">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 transition"
                  placeholder="Enter full name..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 transition"
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Password
                  {isEditing && (
                    <span className="text-gray-400 text-xs font-normal ml-1">
                      (leave blank to keep current)
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 transition"
                  placeholder="Enter password..."
                  value={passwordHash}
                  onChange={(e) => setPasswordHash(e.target.value)}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Role
                </label>
                <select
                  className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isEditingSelf}
                >
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
                {isEditingSelf && (
                  <p className="text-xs text-amber-600 mt-1">
                    You can't change your own role while logged in.
                  </p>
                )}
              </div>

              {/* Active */}
              <div className="flex items-center pt-2">
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    disabled={isEditingSelf}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-500 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <span className="ml-2.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Active Status
                  </span>
                </label>
              </div>
              {isEditingSelf && (
                <p className="text-xs text-amber-600 -mt-3">
                  You can't deactivate your own account while logged in.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-100 dark:border-slate-600 flex flex-col sm:flex-row justify-between gap-3">

              <button
                onClick={() => navigate("/users")}
                className="bg-slate-500 hover:bg-slate-600 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition font-medium order-3 sm:order-1"
              >
                <IconArrowLeft size={18} />
                Back
              </button>

              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2 w-full sm:w-auto">

                <button
                  onClick={clearData}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition font-medium"
                >
                  <IconEraser size={18} />
                  Clear
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition shadow-md font-medium"
                >
                  <IconDeviceFloppy size={18} />
                  {isEditing ? "Update User" : "Save User"}
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default AddEditUser;