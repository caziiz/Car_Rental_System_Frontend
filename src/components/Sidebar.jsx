import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconUsers,
  IconCar,
  IconCreditCard,
  IconLayoutDashboard,
  IconMenu2,
  IconX,
  IconLogout,
  IconFileText,
  IconClipboardList,
} from "@tabler/icons-react";

import { ThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();

  const baseMenu = [
    { label: "Dashboard", path: "/dashboard", icon: <IconLayoutDashboard size={20} /> },
  ];

  const adminMenu = [
    { label: "Users",     path: "/users",     icon: <IconUsers size={20} /> },
    { label: "Vehicles",  path: "/vehicles",  icon: <IconCar size={20} /> },
    { label: "Customers", path: "/customers", icon: <IconUsers size={20} /> },
    { label: "Rentals",   path: "/rentals",   icon: <IconFileText size={20} /> },
    { label: "Payments",  path: "/payments",  icon: <IconCreditCard size={20} /> },
    { label: "Reports", path: "/reports", icon: <IconClipboardList size={20} /> },
  ];

  const staffMenu = [
    { label: "Vehicles",  path: "/vehicles",  icon: <IconCar size={20} /> },
    { label: "Customers", path: "/customers", icon: <IconUsers size={20} /> },
    { label: "Rentals",   path: "/rentals",   icon: <IconFileText size={20} /> },
    { label: "Payments",  path: "/payments",  icon: <IconCreditCard size={20} /> },
  ];

  const menuItems = user?.role === "Admin"
    ? [...baseMenu, ...adminMenu]
    : [...baseMenu, ...staffMenu];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-blue-700 text-white flex items-center justify-between px-4 shadow-md z-50">
        <h1 className="text-lg font-bold">Car Rental</h1>
        <button onClick={() => setIsOpen(true)}>
          <IconMenu2 size={28} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen w-64
        bg-gradient-to-b from-blue-700 to-indigo-800
        text-white flex flex-col shadow-xl z-50
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>
        {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-blue-500">
        <div className="flex items-center gap-3">
          <img
            src="/Logo.jpg"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-xl font-bold">Car Rental</h1>
        </div>

        <button className="lg:hidden" onClick={() => setIsOpen(false)}>
          <IconX size={24} />
        </button>
      </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                location.pathname === item.path
                  ? "bg-white text-blue-700 font-semibold shadow"
                  : "hover:bg-blue-600 text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-blue-500 text-xs text-blue-200 space-y-3">

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <span className="text-sm">{darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
            <div className={`w-10 h-5 flex items-center rounded-full p-1 transition ${darkMode ? "bg-green-400" : "bg-gray-400"}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
            </div>
          </button>

          {/* User Info */}
          <div className="rounded-2xl bg-white/10 p-3 text-left text-sm text-blue-100">
            <p className="font-semibold">{user?.fullName || user?.role}</p>
            <p className="text-xs text-blue-200">{user?.role || "Staff"}</p>
          </div>

          {/* Logout */}
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600 transition"
          >
            <IconLogout size={16} /> Logout
          </button>

          <div className="text-center">Car Rental System © 2026</div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;