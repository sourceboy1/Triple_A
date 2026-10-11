import axios from "axios";

const baseURL = (
  process.env.REACT_APP_API_URL ||
  "https://triplea-production.up.railway.app/api/"
).replace(/\/?$/, "/");

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("token/refresh/")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${baseURL}token/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newAccessToken = response.data.access;

        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;