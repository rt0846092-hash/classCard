import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load user on app start
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");

      if (stored && stored !== "undefined") {
        const parsed = JSON.parse(stored);

        if (parsed?.token) {
          setUser(parsed);
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    } catch (err) {
      console.log("Auth load error:", err);
      localStorage.removeItem("user");
      setUser(null);
    }

    setLoading(false);
  }, []);

  // 🔥 LOGIN (production-ready)
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;

      const userToStore = {
        ...data,
        token: data.token || data.accessToken,
      };

      setUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};