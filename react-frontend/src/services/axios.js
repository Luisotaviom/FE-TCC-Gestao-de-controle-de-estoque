import axios from "axios";
import { parseCookies } from "nookies";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  
});

// Usar interceptador de requisições para definir o token de autorização
instance.interceptors.request.use((config) => {
  const { "finder-token": token } = parseCookies();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
