import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../services/axios";
import { setCookie, parseCookies } from "nookies";
import { useHistory } from "react-router-dom";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const history = useHistory();
  const isAuthenticated = !!user;

  const signIn = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      const { token, user } = response.data;
  
      setCookie(undefined, "finder-token", token, {
        maxAge: 60 * 60 * 1, // 1 hour
      });
  
      console.log("Token após o login:", token); // Verifica se o token está correto após o login
  
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
  
      setUser(user);
      history.push("/WelcomePage");
    } catch (error) {
      console.error("Erro durante o login:", error);
      throw new Error('Login falhou'); // Lançando um novo erro
    }
  };
  
  

  const fetchData = async () => {
    const { "finder-token": token } = parseCookies();
    if (token) {
      try {
        const response = await axiosInstance.get("/auth/userInfo");
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
      }
    } else {
      history.push("/LoginPage");
    }
  };

  useEffect(() => {
    fetchData();
  }, [history]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, fetchData}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);