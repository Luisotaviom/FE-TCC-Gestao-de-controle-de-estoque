import axios from "axios";
import { parseCookies } from "nookies";

// Cria uma instância do axios com a URL base predefinida
const instance = axios.create({
  baseURL: "http://localhost:8080",
});

// Adiciona um interceptor que modifica a configuração de todas as solicitações antes de serem enviadas
instance.interceptors.request.use((config) => {
  const { "finder-token": token } = parseCookies();
  console.log("Interceptor chamado, token:", token);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.error("Token não encontrado nos cookies");
  }
  return config;
}, error => {
  // Faça algo com o erro da solicitação
  return Promise.reject(error);
});



export default instance;
