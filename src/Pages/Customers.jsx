import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import {
  IconUsers, IconUserPlus, IconEdit, IconTrash, IconList, IconSearch,
  IconUserCheck, IconUserOff, IconMail, IconPhone, IconId, IconCalendar,
} from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function Customers() {
  const [customers_data, setCustomers_data] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadCustomersData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Customers`);
      if (response.data.status) setCustomers_data(response.data.data);
    } catch (error) { console.error("Error loading customers data:", error); }
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      const response = await axios.delete(`${API_URL}/Customers/${customerId}`);
      if (response.data.status) { alert("Customer deleted successfully!"); loadCustomersData(); }
      else alert("Failed to delete customer");
    } catch (error) { console.error(error); alert("Failed to delete customer"); }
  };

  useEffect(() => { loadCustomersData(); }, []);

  const totalCustomers       = customers_data.length;
  const blacklistedCustomers = customers_data.filter((c) => c.isBlacklisted).length;
  const activeCustomers      = customers_data.filter((c) => !c.isBlacklisted).length;

  const filtered_data = customers_data.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase()) ||
    c.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-4 sm:p-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-center gap-3 text-white text-center">
            <IconUsers size={28} className="sm:size-[34px] flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">Customer Management</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Total Customers</p><h3 className="text-3xl font-bold text-gray-800 dark:text-white">{totalCustomers}</h3></div>
              <IconUsers size={40} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Active Customers</p><h3 className="text-3xl font-bold text-green-600">{activeCustomers}</h3></div>
              <IconUserCheck size={40} className="text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Blacklisted</p><h3 className="text-3xl font-bold text-red-600">{blacklistedCustomers}</h3></div>
              <IconUserOff size={40} className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 sm:px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconList size={22} className="text-blue-600" />
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">Customers List <span className="ml-2 text-sm font-normal text-gray-400 dark:text-zinc-500">({filtered_data.length})</span></h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 shadow-sm w-full sm:w-auto">
                <IconSearch size={18} className="text-gray-400 flex-shrink-0" />
                <input type="text" placeholder="Search by name, email, phone..." className="outline-none text-sm text-gray-700 dark:text-white dark:bg-zinc-800 w-full sm:w-56" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button onClick={() => navigate("/add-customer")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow w-full sm:w-auto">
                <IconUserPlus size={18} /> Add Customer
              </button>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                  <th className="px-5 py-4 text-left font-semibold">ID</th>
                  <th className="px-5 py-4 text-left font-semibold">Full Name</th>
                  <th className="px-5 py-4 text-left font-semibold">Email</th>
                  <th className="px-5 py-4 text-left font-semibold">Phone</th>
                  <th className="px-5 py-4 text-left font-semibold">License No.</th>
                  <th className="px-5 py-4 text-left font-semibold">Status</th>
                  <th className="px-5 py-4 text-left font-semibold">Created At</th>
                  <th className="px-5 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered_data.length > 0 ? filtered_data.map((customer) => (
                  <tr key={customer.customerId} className="border-b dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 transition">
                    <td className="px-5 py-4 dark:text-zinc-300">{customer.customerId}</td>
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">{customer.fullName}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{customer.email}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{customer.phone}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{customer.licenseNumber}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.isBlacklisted ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{customer.isBlacklisted ? "Blacklisted" : "Active"}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => navigate(`/edit-customer/${customer.customerId}`)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition shadow-sm"><IconEdit size={18} /></button>
                        <button onClick={() => handleDelete(customer.customerId)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition shadow-sm"><IconTrash size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan="8" className="text-center py-10 text-gray-500 dark:text-zinc-400">No customers found.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="md:hidden">
            {filtered_data.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-zinc-700">
                {filtered_data.map((customer) => (
                  <div key={customer.customerId} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{customer.fullName}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">#{customer.customerId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${customer.isBlacklisted ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{customer.isBlacklisted ? "Blacklisted" : "Active"}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconMail size={16} className="text-gray-400 flex-shrink-0" /><span className="truncate">{customer.email}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconPhone size={16} className="text-gray-400 flex-shrink-0" /><span>{customer.phone}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconId size={16} className="text-gray-400 flex-shrink-0" /><span>{customer.licenseNumber}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCalendar size={16} className="text-gray-400 flex-shrink-0" /><span>{new Date(customer.createdAt).toLocaleDateString()}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/edit-customer/${customer.customerId}`)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm font-medium"><IconEdit size={16} />Edit</button>
                      <button onClick={() => handleDelete(customer.customerId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm font-medium"><IconTrash size={16} />Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="text-center py-10 text-gray-500 dark:text-zinc-400">No customers found.</div>}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Customers;