import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import AddButton from "../components/AddButton";
import Badge from "../components/Badge";
import ActionButtons from "../components/ActionButtons";
import ConfirmModal from "../components/ConfirmModal";
import SearchInput from "../components/SearchInput";
import {
  IconCreditCard, IconList,
  IconCircleCheck, IconClock, IconRefresh, IconCurrencyDollar,
  IconCar, IconCalendar,
} from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function Payments() {
  const [payments_data, setPayments_data] = useState([]);
  const [rentals_data, setRentals_data]   = useState([]);
  const [totalRevenue, setTotalRevenue]   = useState(0);
  const [search, setSearch]               = useState("");
  const [confirmId, setConfirmId]         = useState(null); // paymentId pending delete
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

  const confirmDelete = async () => {
    const paymentId = confirmId;
    setConfirmId(null);
    try {
      const response = await axios.delete(`${API_URL}/Payments/${paymentId}`);
      if (response.data.status) { alert("Payment deleted successfully!"); loadPaymentsData(); }
      else alert("Failed to delete payment");
    } catch (error) { console.error(error); alert("Failed to delete payment"); }
  };

  const getRentalTotal = (rentalId) => {
    const rental = rentals_data.find((r) => r.rentalId === rentalId);
    return rental?.totalAmount || 0;
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "green";
      case "Pending":   return "yellow";
      case "Refunded":  return "red";
      default:          return "gray";
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "Cash":          return "blue";
      case "Credit Card":   return "purple";
      case "Debit Card":    return "indigo";
      case "Bank Transfer": return "orange";
      default:              return "gray";
    }
  };

  const renderActions = (payment) => (
    <div className="flex justify-center items-center gap-2">
      {payment.status === "Pending" && (
        <button
          onClick={() => handleUpdateStatus(payment.paymentId, "Completed")}
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg text-xs transition"
        >
          Complete
        </button>
      )}
      {payment.status === "Completed" && (
        <button
          onClick={() => handleUpdateStatus(payment.paymentId, "Refunded")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-lg text-xs transition"
        >
          Refund
        </button>
      )}
      <ActionButtons showEdit={false} onDelete={() => setConfirmId(payment.paymentId)} />
    </div>
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-4 sm:p-6">

        <PageHeader title="Payment Management" icon={IconCreditCard} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Revenue" value={`$${totalRevenue}`} icon={IconCurrencyDollar} iconColor="text-blue-500" valueColor="text-blue-600" />
          <StatCard label="Completed"     value={completedPayments}  icon={IconCircleCheck}     iconColor="text-green-500" valueColor="text-green-600" />
          <StatCard label="Pending"       value={pendingPayments}    icon={IconClock}            iconColor="text-yellow-500" valueColor="text-yellow-600" />
          <StatCard label="Refunded"      value={refundedPayments}   icon={IconRefresh}          iconColor="text-red-500" valueColor="text-red-600" />
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 sm:px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconList size={22} className="text-blue-600" />
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                Payments List <span className="ml-2 text-sm font-normal text-gray-400 dark:text-zinc-500">({filtered_data.length})</span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search by customer, method..." />
              <AddButton label="Add Payment" to="/add-payment" />
            </div>
          </div>

          {/* Desktop Table */}
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
                      <td className="px-5 py-4"><Badge label={payment.paymentMethod} color={getMethodColor(payment.paymentMethod)} /></td>
                      <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className="px-5 py-4"><Badge label={payment.status} color={getStatusColor(payment.status)} /></td>
                      <td className="px-5 py-4">{renderActions(payment)}</td>
                    </tr>
                  );
                }) : <tr><td colSpan="9" className="text-center py-10 text-gray-500 dark:text-zinc-400">No payments found.</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
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
                        <Badge label={payment.status} color={getStatusColor(payment.status)} />
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
                        <Badge label={payment.paymentMethod} color={getMethodColor(payment.paymentMethod)} />
                      </div>
                      {renderActions(payment)}
                    </div>
                  );
                })}
              </div>
            ) : <div className="text-center py-10 text-gray-500 dark:text-zinc-400">No payments found.</div>}
          </div>
        </div>

        <ConfirmModal
          isOpen={confirmId !== null}
          title="Delete Payment"
          message="Are you sure you want to delete this payment? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      </div>
    </AnimatedPage>
  );
}

export default Payments;