import axios from "axios";
import { API } from "@env"; // asegúrate que en .env tienes API=https://pergola-production.up.railway.app/api

// Cliente base de Axios
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tokens (se agregará después cuando integremos auth)
apiClient.interceptors.request.use(
  async (config) => {
    // Aquí puedes obtener el token del AsyncStorage
    // const token = await AsyncStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
