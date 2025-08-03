import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG, STORAGE_KEYS } from "../config/constants";

// Instancia principal de API con autenticación
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instancia pública sin autenticación
export const publicApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["admin-token"] = token;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar tokens expirados
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      console.log("Token expirado, por favor inicia sesión nuevamente");
    }
    return Promise.reject(error);
  }
);

// Alias para compatibilidad con servicios que usan privateApi
export const privateApi = api;