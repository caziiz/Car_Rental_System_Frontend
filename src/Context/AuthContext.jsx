import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "car_rental_user";
const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

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

  const findUserByEmail = (users, email) => {
    return users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  };

  const login = async ({ email, password }) => {
    if (!API_URL) {
      return { success: false, message: "Backend API URL is not configured." };
    }

    try {
      const endpoint = `${API_URL}/Users`;
      const response = await axios.get(endpoint);
      const result = response.data;

      if (!result?.status || !Array.isArray(result.data)) {
        return { success: false, message: "Unable to fetch user data from backend." };
      }

      const foundUser = findUserByEmail(result.data, email);
      if (!foundUser) {
        return { success: false, message: "Invalid email or password." };
      }

      if (!foundUser.isActive) {
        return { success: false, message: "Your account is inactive." };
      }

      if (foundUser.passwordHash !== password) {
        return { success: false, message: "Invalid email or password." };
      }

      const nextUser = {
        userId: foundUser.userId,
        fullName: foundUser.fullName || foundUser.email,
        email: foundUser.email,
        role: foundUser.role,
        isActive: foundUser.isActive,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      return { success: true, user: nextUser };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === "Admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
