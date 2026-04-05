import axios from "axios";

const defaultApiBaseUrl =
  import.meta.env.MODE === "production" ? "/api" : "http://localhost:5000/api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tuitionrider_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getGoogleAuthUrl = () =>
  `${API_BASE_URL.replace(/\/api$/, "")}/api/auth/google`;
