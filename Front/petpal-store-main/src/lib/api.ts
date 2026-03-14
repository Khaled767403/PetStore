import axios from "axios";
import { API_BASE_URL } from "./env";
import { useAuthStore } from "@/stores/auth-store";

console.log("API_BASE_URL =", API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const logout = useAuthStore.getState().logout;
      logout();
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);