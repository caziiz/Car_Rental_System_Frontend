import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import Badge from "../components/Badge";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import ActionButtons from "../components/ActionButtons";
import AddButton from "../components/AddButton";
import ConfirmModal from "../components/ConfirmModal";
import SearchInput from "../components/SearchInput";
import {
  IconUsers, IconList,
  IconUserCheck, IconUserOff, IconMail, IconPhone, IconId, IconCalendar,
} from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function Customers() {
  const [customers_data, setCustomers_data] = useState([]);
  const [search, setSearch]                 = useState("");
  const [confirmId, setConfirmId]           = useState(null); // customerId pending delete
  const navigate = useNavigate();

  const loadCustomersData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Customers`);
      if (response.data.status) setCustomers_data(response.data.data);
    } catch (error) { console.error("Error loading customers data:", error); }
  };

  const confirmDelete = async () => {
    const customerId = confirmId;
    setConfirmId(null);
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

        {/* Header */}
        <PageHeader title="Customer Management" icon={IconUsers} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Customers"  value={totalCustomers}       icon={IconUsers}     iconColor="text-blue-500" />
          <StatCard label="Active Customers" value={activeCustomers}      icon={IconUserCheck} iconColor="text-green-500" valueColor="text-green-600" />
          <StatCard label="Blacklisted"      value={blacklistedCustomers} icon={IconUserOff}   iconColor="text-red-500"   valueColor="text-red-600" />
        </div>

        {/* Customers Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 sm:px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconList size={22} className="text-blue-600" />
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                Customers List <span className="ml-2 text-sm font-normal text-gray-400 dark:text-zinc-500">({filtered_data.length})</span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email, phone..." />
              <AddButton label="Add Customer" to="/add-customer" />
            </div>
          </div>

          {/* Desktop Table */}
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
                      <Badge label={customer.isBlacklisted ? "Blacklisted" : "Active"} color={customer.isBlacklisted ? "red" : "green"} />
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <ActionButtons
                        onEdit={() => navigate(`/edit-customer/${customer.customerId}`)}
                        onDelete={() => setConfirmId(customer.customerId)}
                      />
                    </td>
                  </tr>
                )) : <tr><td colSpan="8" className="text-center py-10 text-gray-500 dark:text-zinc-400">No customers found.</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
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
                      <Badge label={customer.isBlacklisted ? "Blacklisted" : "Active"} color={customer.isBlacklisted ? "red" : "green"} />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconMail size={16} className="text-gray-400 flex-shrink-0" /><span className="truncate">{customer.email}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconPhone size={16} className="text-gray-400 flex-shrink-0" /><span>{customer.phone}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconId size={16} className="text-gray-400 flex-shrink-0" /><span>{customer.licenseNumber}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCalendar size={16} className="text-gray-400 flex-shrink-0" /><span>{new Date(customer.createdAt).toLocaleDateString()}</span></div>
                    </div>
                    <ActionButtons
                      onEdit={() => navigate(`/edit-customer/${customer.customerId}`)}
                      onDelete={() => setConfirmId(customer.customerId)}
                    />
                  </div>
                ))}
              </div>
            ) : <div className="text-center py-10 text-gray-500 dark:text-zinc-400">No customers found.</div>}
          </div>

        </div>

        <ConfirmModal
          isOpen={confirmId !== null}
          title="Delete Customer"
          message="Are you sure you want to delete this customer? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      </div>
    </AnimatedPage>
  );
}

export default Customers;