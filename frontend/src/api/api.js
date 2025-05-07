// src/api/api.js
import axios from "axios";

const api = axios.create({
 baseURL: "http://localhost:8080/api",
 //baseURL:"https://wealthverse.duckdns.org/api",
});

// Attach token from localStorage (or another secure place)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// // Response interceptor to handle token expiration and refresh
// api.interceptors.response.use(
//   (response) => response, // Allow response to pass through
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error is due to token expiration
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // Get the refresh token from localStorage
//       const refreshToken = localStorage.getItem("refresh_token");

//       if (refreshToken) {
//         try {
//           // Try to get a new access token using the refresh token
//           const response = await axios.post("/auth/refresh", { refresh_token: refreshToken });

//           // Save the new access token
//           const newAccessToken = response.data.access_token;
//           localStorage.setItem("token", newAccessToken);

//           // Update the original request with the new access token
//           originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

//           // Retry the original request
//           return axios(originalRequest);
//         } catch (err) {
//           // If refresh token request fails, log the user out
//           console.error("Refresh token failed:", err);
//           localStorage.removeItem("token");
//           localStorage.removeItem("refresh_token");
//           window.location.href = "/login"; // Redirect to login
//           return Promise.reject(err);
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
