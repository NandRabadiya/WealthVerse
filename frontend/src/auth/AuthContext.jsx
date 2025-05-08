// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false); // done restoring
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refresh_token", res.data.refreshToken);
      localStorage.setItem("userId", res.data.id);
      setToken(res.data.accessToken);
      setLoading(false);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async (name, email, password, dob) => {
    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
        dob,
      });

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refresh_token", res.data.refreshToken);
      localStorage.setItem("userId", res.data.id);

      setToken(res.data.accessToken);
      setLoading(false);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("userId");
      setToken(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
