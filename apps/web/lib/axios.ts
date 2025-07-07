/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { persistor, store } from "./store";
import { toast } from "sonner";
import { getAccessToken, setAccessToken } from "./token";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  timeout: 30000,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];
let isLoggingOut = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axiosClient.get("/auth/refresh-token");
        const newAccessToken = res.data.data.access_token;

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // If refresh token is invalid (e.g. 410), redirect to login
        if (
          axios.isAxiosError(err) &&
          err.response?.status === 410 &&
          !isLoggingOut
        ) {
          isLoggingOut = true;
          toast.error("Your session has expired. Redirecting to login");

          store.dispatch({ type: "RESET" });
          await persistor.purge();

          setTimeout(() => {
            window.location.replace("/auth/sign-in");
          }, 1500);
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
