import { apiClient } from "./httpClient";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchBrands = async () => {
  const response = await apiClient.get(`/v1/brands`);
  if (!response.ok) throw new Error("Failed to fetch brands");
  const data = await response.json();
  return data.map((brand) => ({
    brandId: brand.id || brand.brandId,
    name: brand.name,
  }));
};

export const fetchBrandById = async (brandId) => {
  const response = await apiClient.get(`/v1/brands/${brandId}`);
  if (!response.ok) throw new Error("Failed to fetch brand");
  return await response.json();
};

export const addBrand = async (brand) => {
  try {
    const res = await apiClient.postJson(`/v1/brands`, brand);

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    return null;
  }
};

export const updateBrand = async (brandId, brand) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await apiClient.putJson(
      `/v1/brands/${brandId}`,
      brand,
      { signal: controller.signal }
    );
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

export const deleteBrandById = async (brandId) => {
  const response = await apiClient.delete(`/v1/brands/${brandId}`);
  if (!response.ok) throw new Error("Failed to delete brand");
  return true;
};
