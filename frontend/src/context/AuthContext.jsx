import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
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

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const data = res.data;

      const userToStore = {
        ...data,
        token: data.token || data.accessToken
      };

      setUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed"
      };
    }
  };

  // REGISTER
  const register = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      const data = res.data;

      const userToStore = {
        ...data,
        token: data.token || data.accessToken
      };

      setUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Register failed"
      };
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};