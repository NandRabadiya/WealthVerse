// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null); // ✅ Add userId to state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId); // ✅ Load userId into state
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { accessToken, refreshToken, id } = res.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("userId", id);

      setToken(accessToken);
      setUserId(id); // ✅ Set userId
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
      const { accessToken, refreshToken, id } = res.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("userId", id);

      setToken(accessToken);
      setUserId(id); // ✅ Set userId
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
      setUserId(null); // ✅ Clear userId
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, userId, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
