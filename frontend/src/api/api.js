// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Replace with your backend URL
});

export default api;
