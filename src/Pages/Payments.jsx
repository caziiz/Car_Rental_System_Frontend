import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import {
  IconCreditCard, IconPlus, IconTrash, IconList, IconSearch,
  IconCircleCheck, IconClock, IconRefresh, IconCurrencyDollar,
  IconCar, IconCalendar,
} from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function Payments() {
  const [payments_data, setPayments_data] = useState([]);
  const [rentals_data, setRentals_data]   = useState([]);
  const [totalRevenue, setTotalRevenue]   = useState(0);
  const [search, setSearch]               = useState("");
  const navigate = useNavigate();

  const loadPaymentsData = async () => {
    try {
      const [paymentsRes, revenueRes, rentalsRes] = await Promise.all([
        axios.get(`${API_URL}/Payments`),
        axios.get(`${API_URL}/Payments/revenue`),
        axios.get(`${API_URL}/Rentals`),
      ]);
      if (paymentsRes.data.status) setPayments_data(paymentsRes.data.data);
      if (revenueRes.data.status)  setTotalRevenue(revenueRes.data.data);
      if (rentalsRes.data.status)  setRentals_data(rentalsRes.data.data);
    } catch (error) { console.error("Error loading payments data:", error); }
  };

  const handleUpdateStatus = async (paymentId, status) => {
    try {
      const response = await axios.put(`${API_URL}/Payments/status/${paymentId}/${status}`);
      if (response.data.status) { alert(`Payment marked as ${status}!`); loadPaymentsData(); }
      else alert("Failed to update payment status");
    } catch (error) { console.error(error); alert("Failed to update payment status"); }
  };

  const handleDelete = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      const response = await axios.delete(`${API_URL}/Payments/${paymentId}`);
      if (response.data.status) { alert("Payment deleted successfully!"); loadPaymentsData(); }
      else alert("Failed to delete payment");
    } catch (error) { console.error(error); alert("Failed to delete payment"); }
  };

  // Get total amount due for a rental
  const getRentalTotal = (rentalId) => {
    const rental = rentals_data.find((r) => r.rentalId === rentalId);
    return rental?.totalAmount || 0;
  };

  // Get remaining amount for a pending payment
  const getRemaining = (payment) => {
    const total = getRentalTotal(payment.rentalId);
    if (!total) return null;
    return Math.max(0, total - payment.amount);
  };

  useEffect(() => { loadPaymentsData(); }, []);

  const completedPayments = payments_data.filter((p) => p.status === "Completed").length;
  const pendingPayments   = payments_data.filter((p) => p.status === "Pending").length;
  const refundedPayments  = payments_data.filter((p) => p.status === "Refunded").length;

  const filtered_data = payments_data.filter((p) =>
    p.customerName.toLowerCase().includes(search.toLowerCase()) ||
    p.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
    p.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
    p.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "Pending":   return "bg-yellow-100 text-yellow-700";
      case "Refunded":  return "bg-red-100 text-red-700";
      default:          return "bg-gray-100 text-gray-700";
    }
  };

  const getMethodStyle = (method) => {
    switch (method) {
      case "Cash":          return "bg-blue-100 text-blue-700";
      case "Credit Card":   return "bg-purple-100 text-purple-700";
      case "Debit Card":    return "bg-indigo-100 text-indigo-700";
      case "Bank Transfer": return "bg-orange-100 text-orange-700";
      default:              return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-4 sm:p-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-center gap-3 text-white text-center">
            <IconCreditCard size={28} className="sm:size-[34px] flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">Payment Management</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Total Revenue</p><h3 className="text-3xl font-bold text-blue-600">${totalRevenue}</h3></div>
              <IconCurrencyDollar size={40} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Completed</p><h3 className="text-3xl font-bold text-green-600">{completedPayments}</h3></div>
              <IconCircleCheck size={40} className="text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Pending</p><h3 className="text-3xl font-bold text-yellow-600">{pendingPayments}</h3></div>
              <IconClock size={40} className="text-yellow-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 dark:text-zinc-400 text-sm">Refunded</p><h3 className="text-3xl font-bold text-red-600">{refundedPayments}</h3></div>
              <IconRefresh size={40} className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 sm:px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconList size={22} className="text-blue-600" />
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">Payments List <span className="ml-2 text-sm font-normal text-gray-400 dark:text-zinc-500">({filtered_data.length})</span></h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 shadow-sm w-full sm:w-auto">
                <IconSearch size={18} className="text-gray-400 flex-shrink-0" />
                <input type="text" placeholder="Search by customer, method..." className="outline-none text-sm text-gray-700 dark:text-white dark:bg-zinc-800 w-full sm:w-56" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button onClick={() => navigate("/add-payment")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow w-full sm:w-auto">
                <IconPlus size={18} /> Add Payment
              </button>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                  <th className="px-5 py-4 text-left font-semibold">ID</th>
                  <th className="px-5 py-4 text-left font-semibold">Customer</th>
                  <th className="px-5 py-4 text-left font-semibold">Vehicle</th>
                  <th className="px-5 py-4 text-left font-semibold">Paid</th>
                  <th className="px-5 py-4 text-left font-semibold">Remaining</th>
                  <th className="px-5 py-4 text-left font-semibold">Method</th>
                  <th className="px-5 py-4 text-left font-semibold">Date</th>
                  <th className="px-5 py-4 text-left font-semibold">Status</th>
                  <th className="px-5 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered_data.length > 0 ? filtered_data.map((payment) => {
                  const remaining = getRemaining(payment);
                  return (
                    <tr key={payment.paymentId} className="border-b dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 transition">
                      <td className="px-5 py-4 dark:text-zinc-300">{payment.paymentId}</td>
                      <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">{payment.customerName}</td>
                      <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{payment.vehicleName}</td>
                      <td className="px-5 py-4 font-semibold text-green-600">${payment.amount}</td>
                      <td className="px-5 py-4">
                        {payment.status === "Pending" && remaining !== null ? (
                          <span className="font-semibold text-red-500">${remaining.toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-400 dark:text-zinc-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMethodStyle(payment.paymentMethod)}`}>{payment.paymentMethod}</span></td>
                      <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(payment.status)}`}>{payment.status}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          {payment.status === "Pending" && <button onClick={() => handleUpdateStatus(payment.paymentId, "Completed")} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg text-xs transition">Complete</button>}
                          {payment.status === "Completed" && <button onClick={() => handleUpdateStatus(payment.paymentId, "Refunded")} className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-lg text-xs transition">Refund</button>}
                          <button onClick={() => handleDelete(payment.paymentId)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition shadow-sm"><IconTrash size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : <tr><td colSpan="9" className="text-center py-10 text-gray-500 dark:text-zinc-400">No payments found.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="md:hidden">
            {filtered_data.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-zinc-700">
                {filtered_data.map((payment) => {
                  const remaining = getRemaining(payment);
                  return (
                    <div key={payment.paymentId} className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">{payment.customerName}</p>
                          <p className="text-xs text-gray-400 dark:text-zinc-500">#{payment.paymentId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(payment.status)}`}>{payment.status}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCar size={16} className="text-gray-400 flex-shrink-0" /><span>{payment.vehicleName}</span></div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCalendar size={16} className="text-gray-400 flex-shrink-0" /><span>{new Date(payment.paymentDate).toLocaleDateString()}</span></div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-green-600">Paid: ${payment.amount}</span>
                          {payment.status === "Pending" && remaining !== null && (
                            <span className="font-semibold text-red-500">Remaining: ${remaining.toFixed(2)}</span>
                          )}
                        </div>
                        <div><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getMethodStyle(payment.paymentMethod)}`}>{payment.paymentMethod}</span></div>
                      </div>
                      <div className="flex gap-2">
                        {payment.status === "Pending" && <button onClick={() => handleUpdateStatus(payment.paymentId, "Completed")} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition">Complete</button>}
                        {payment.status === "Completed" && <button onClick={() => handleUpdateStatus(payment.paymentId, "Refunded")} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition">Refund</button>}
                        <button onClick={() => handleDelete(payment.paymentId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm font-medium"><IconTrash size={16} />Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <div className="text-center py-10 text-gray-500 dark:text-zinc-400">No payments found.</div>}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Payments;