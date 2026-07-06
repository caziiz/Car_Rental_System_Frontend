import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Users from "./Pages/Users";
import AddEditUser from "./Services/AddEditUser";
import Vehicles from "./Pages/Vehicles";
import AddEditVehicle from "./Services/AddEditVehicle";
import NotFound from "./components/Notfound";
import Dashboard from "./Pages/Dashboard";
import Customers from "./Pages/Customers";
import AddEditCustomer from "./Services/AddEditCustomer";
import Rentals from "./Pages/Rentals";
import AddRental from "./Services/AddRental";
import Payments from "./Pages/Payments";
import AddPayment from "./Services/AddPayment";
import Login from "./Pages/Login";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Reports from "./Pages/Reports";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";




function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Admin") return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <div className="flex">
        {user && <Sidebar />}

        <div className={`flex-1 min-h-screen bg-slate-100 dark:bg-slate-900 text-black dark:text-white ${user ? "lg:ml-64" : ""} pt-16 lg:pt-0`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />

            {/* Dashboard - All logged in users */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Users - Admin only */}
            <Route path="/users"           element={<AdminRoute><Users /></AdminRoute>} />
            <Route path="/add-user"        element={<AdminRoute><AddEditUser /></AdminRoute>} />
            <Route path="/edit-user/:userId" element={<AdminRoute><AddEditUser /></AdminRoute>} />

            {/* Vehicles - Admin & Staff */}
            <Route path="/vehicles"              element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
            <Route path="/add-vehicle"           element={<ProtectedRoute><AddEditVehicle /></ProtectedRoute>} />
            <Route path="/edit-vehicle/:vehicleId" element={<ProtectedRoute><AddEditVehicle /></ProtectedRoute>} />

            {/* Customers - Admin & Staff */}
            <Route path="/customers"                 element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/add-customer"              element={<ProtectedRoute><AddEditCustomer /></ProtectedRoute>} />
            <Route path="/edit-customer/:customerId" element={<ProtectedRoute><AddEditCustomer /></ProtectedRoute>} />

            {/* Rentals - Admin & Staff */}
            <Route path="/rentals"    element={<ProtectedRoute><Rentals /></ProtectedRoute>} />
            <Route path="/add-rental" element={<ProtectedRoute><AddRental /></ProtectedRoute>} />

            {/* Payments - Admin & Staff */}
            <Route path="/payments"    element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/add-payment" element={<ProtectedRoute><AddPayment /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={user ? <NotFound /> : <Navigate to="/login" replace />} />

            {/* Reports */}
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

            {/* Register */}
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function AppWithProviders() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithProviders;