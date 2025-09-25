//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { apiClient } from "./httpClient";

export const fetchStorage = async () => {
  const response = await apiClient.get(`/v1/storage`);
  if (!response.ok) throw new Error("Failed to fetch storage");
  const data = await response.json(); // [32, 64, 128...]

  return data.map((size) => ({
    label: size === -1 ? "Not specified" : formatStorage(size),
    value: size,
  }));
};

// helper แปลงเป็น GB / TB
function formatStorage(size) {
  if (size === -1) return "Not specified";
  if (size >= 1000) {
    const tb = size / 1000;
    return Number.isInteger(tb) ? `${tb} TB` : `${tb.toFixed(1)} TB`;
  }
  return `${size} GB`;
}

