import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      error.response?.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
        ? String(error.response.data.message)
        : error.message || "Unexpected API error";

    return Promise.reject(
      new Error(`API request failed: ${message}`, { cause: error })
    );
  }
);
