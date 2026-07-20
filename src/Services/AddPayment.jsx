import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import api from "./api";  // same folder
import {
  IconCreditCard,
  IconDeviceFloppy,
  IconEraser,
  IconArrowLeft,
} from "@tabler/icons-react";


function AddPayment() {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [rentalId, setRentalId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [status, setStatus] = useState("Completed");
  const [notes, setNotes] = useState("");
  const [totalDue, setTotalDue] = useState(0);

  const loadRentals = async () => {
    try {
      const response = await api.get(`/Rentals`);
      if (response.data.status) {
        setRentals(response.data.data.filter((r) => r.status === "Active"));
      }
    } catch (error) {
      console.error("Error loading rentals:", error);
    }
  };

  const handleRentalChange = (e) => {
    const selectedId = e.target.value;
    setRentalId(selectedId);

    const selectedRental = rentals.find((r) => r.rentalId === Number(selectedId));
    if (selectedRental) {
      let due = 0;
      if (selectedRental.totalAmount) {
        due = selectedRental.totalAmount;
      } else if (selectedRental.dailyRate) {
        const start = new Date(selectedRental.startDate);
        // Use actualEndDate if the rental has been returned, otherwise
        // fall back to expectedEndDate. Only use "today" as a last resort
        // if neither date is available.
        const endDateStr =
          selectedRental.actualEndDate ||
          selectedRental.expectedEndDate ||
          null;
        const end = endDateStr ? new Date(endDateStr) : new Date();
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        due = parseFloat((days * selectedRental.dailyRate).toFixed(2));
      }
      setTotalDue(due);
      setAmount(due);
      setStatus("Completed"); // reset status
    }
  };

  // Auto set status based on amount vs total due
  const handleAmountChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setAmount(e.target.value);
    if (totalDue > 0 && val < totalDue) {
      setStatus("Pending");
    } else {
      setStatus("Completed");
    }
  };

  useEffect(() => { loadRentals(); }, []);

  const validateInputs = () => {
    if (!rentalId) return alert("Please select a rental"), false;
    if (!amount)   return alert("Please enter amount"), false;
    return true;
  };

  const clearData = () => {
    setRentalId("");
    setAmount("");
    setPaymentMethod("Cash");
    setStatus("Completed");
    setNotes("");
    setTotalDue(0);
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    try {
      const payment = {
        rentalId:      Number(rentalId),
        amount:        parseFloat(amount),
        paymentMethod,
        status,
        notes,
        paymentDate:   new Date().toISOString(),
      };
      const response = await api.post(`/Payments`, payment);
      if (response.data.status) {
        alert("Payment added successfully!");
        navigate("/payments");
      } else {
        alert("Failed to add payment: " + response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const selectedRental = rentals.find((r) => r.rentalId === Number(rentalId));
  const remaining = totalDue > 0 ? Math.max(0, totalDue - (parseFloat(amount) || 0)) : 0;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 transition-colors duration-300">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-center gap-3 text-white text-center">
            <IconCreditCard size={28} className="sm:size-[34px]" />
            <h1 className="text-2xl sm:text-3xl font-bold">Add Payment</h1>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg max-w-2xl mx-auto transition-colors">
          <div className="bg-slate-50 dark:bg-slate-700 px-5 sm:px-6 py-4 border-b rounded-t-2xl font-semibold text-gray-800 dark:text-gray-100 border-slate-200 dark:border-slate-600">
            Enter Payment Details
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Rental */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Select Rental</label>
              <select className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={rentalId} onChange={handleRentalChange}>
                <option value="">Select rental...</option>
                {rentals.map((r) => (
                  <option key={r.rentalId} value={r.rentalId}>
                    #{r.rentalId} — {r.customerName} → {r.vehicleName} ({r.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Rental Summary */}
            {selectedRental && (
              <div className="md:col-span-2 bg-blue-50 dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl p-4">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">Rental Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Customer</p>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{selectedRental.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Total Due</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">${totalDue}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Paying</p>
                    <p className="font-bold text-green-600">${parseFloat(amount) || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Remaining</p>
                    <p className={`font-bold ${remaining > 0 ? "text-red-500" : "text-green-600"}`}>
                      ${remaining.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                {remaining > 0 && (
                  <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg px-3 py-2 text-sm text-yellow-700 dark:text-yellow-400">
                    ⚠️ Amount is less than total due — status will be set to <strong>Pending</strong>
                  </div>
                )}
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Amount ($)</label>
              <input type="number" className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={amount} onChange={handleAmountChange} />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Payment Method</label>
              <select className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            {/* Status - readonly, auto set */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
              <div className={`w-full border rounded-lg px-3 py-2 font-semibold text-sm ${
                status === "Completed"
                  ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
              }`}>
                {status === "Completed" ? "✅ Completed" : "⏳ Pending"}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Notes <span className="text-gray-400 text-xs">(optional)</span></label>
              <input type="text" className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

          </div>

          <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-700 rounded-b-2xl flex flex-col sm:flex-row sm:justify-between gap-3">
            <button onClick={() => navigate("/payments")} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto">
              <IconArrowLeft size={18} /> Back
            </button>
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={clearData} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                <IconEraser size={18} /> Clear
              </button>
              <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                <IconDeviceFloppy size={18} /> Save Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default AddPayment;