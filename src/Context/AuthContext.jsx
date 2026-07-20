import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "car_rental_user";
const API_URL = import.meta.env.VITE_API_CAR_RENTAL; // ← this was missing

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async ({ email, password }) => {
    if (!API_URL) {
      return { success: false, message: "Backend API URL is not configured." };
    }
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const result = response.data;

      if (!result?.status) {
        return { success: false, message: result?.message || "Invalid email or password." };
      }

      const nextUser = {
        email: result.email,
        role: result.role === "ROLE_ADMIN" ? "Admin" : "Staff",
        token: result.token,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      return { success: true, user: nextUser };

    } catch (error) {
      console.error("Login failed:", error);
      if (error.response?.status === 401) {
        return { success: false, message: "Invalid email or password." };
      }
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const register = async ({ fullName, email, password, role }) => {
    if (!API_URL) {
      return { success: false, message: "Backend API URL is not configured." };
    }
    try {
      const response = await axios.post(`${API_URL}/Users`, {
        fullName: fullName.trim(),
        email: email.trim(),
        passwordHash: password.trim(),
        role,
      });
      const result = response.data;
      if (!result?.status) {
        return { success: false, message: result?.message || "Registration failed." };
      }
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, message: "Registration failed. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === "Admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}