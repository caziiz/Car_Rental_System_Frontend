import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_CAR_RENTAL,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("car_rental_user");
  if (stored) {
    const userData = JSON.parse(stored);
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
});

export default api;