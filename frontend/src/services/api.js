import axios from "axios";

const api = axios.create({
  baseURL: "https://classcard-4sfw.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// 🔥 TOKEN ATTACHMENT (SAFE)
api.interceptors.request.use((config) => {
  try {
    const user = localStorage.getItem("user");

    if (user && user !== "undefined") {
      const parsed = JSON.parse(user);

      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch (err) {
    console.log("Token parse error:", err);
    localStorage.removeItem("user");
  }

  return config;
});

// 🔥 GLOBAL ERROR HANDLING
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;