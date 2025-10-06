import { apiClient } from "./httpClient";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getItem = async (path) => {
  // const response = await fetch(`${API_BASE_URL}/${path}`);
  const response = await apiClient.get(`/${path}`);
  if (!response.ok) throw new Error("Failed to fetch sale items");
  return await response.json();
};

// export const fetchSaleItems = async () => {
//   const response = await fetch(`${API_BASE_URL}/v1/sale-items`);
//   if (!response.ok) throw new Error("Failed to fetch sale items");
//   return await response.json();
// };
export const fetchSaleItems = async ({
  sellerId,
  page = 0,
  size = 10,
  sortField,
  sortDirection = "asc",
}) => {
  if (page === undefined || page === null) {
    throw new Error('Parameter "page" is required and cannot be undefined');
  }
  let searchParams = `?page=${page}&size=${size}`;
  if (sortField) searchParams += `&sortField=${sortField}`;
  if (sortDirection) searchParams += `&sortDirection=${sortDirection}`;

  const response = await apiClient.get(
    `/v2/sellers/${sellerId}/sale-items${searchParams}`
  );
  if (!response.ok) throw new Error("Failed to fetch sale items");
  return await response.json();
};

export const fetchItemById = async (saleItemId) => {
  // const response = await fetch(`${API_BASE_URL}/v1/sale-items/${saleItemId}`);

  const response = await apiClient.get(`/v1/sale-items/${saleItemId}`);
  if (!response.ok) throw new Error("Failed to fetch item");
  return await response.json();
};

export const addSaleItem = async (formData, id) => {
  try {
    const res = await apiClient.postForm(
      `/v2/sellers/${id}/sale-items`,
      formData
    );
    if (!res.ok) throw new Error("Failed to create new sale item");

    return await res.json();
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};

//add user

export const updateSaleItem = async (
  sellerId,
  saleItemId,
  saleItemFormData
) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await apiClient.putFormData(
      `/v2/sellers/${sellerId}/sale-items/${saleItemId}`,
      saleItemFormData
    );

    if (response.status >= 500) throw new Error("Server error");

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

export const deleteItemById = async (sellerId, saleItemId) => {
  const response = await apiClient.delete(
    `/v2/sellers/${sellerId}/sale-items/${saleItemId}`
  );
  if (!response.ok) throw new Error("Failed to delete item");
  return true;
};

export const fetchSaleItemsV2 = async (
  filterBrands = [],
  page,
  size = 10,
  sortField,
  sortDirection = "asc",
  storageSizes = [],
  minPrice,
  maxPrice,
  search
) => {
  if (page === undefined || page === null) {
    throw new Error('Parameter "page" is required and cannot be undefined');
  }

  let searchParams = `?page=${page}&size=${size}`;
  if (sortField) searchParams += `&sortField=${sortField}`;
  if (sortDirection) searchParams += `&sortDirection=${sortDirection}`;
  if (minPrice) searchParams += `&lowerPrice=${minPrice}`;
  if (maxPrice) searchParams += `&upperPrice=${maxPrice}`;
  if (search) searchParams += `&searchKeyWord=${search}`;

  filterBrands.forEach((brand) => (searchParams += `&filterBrands=${brand}`));
  storageSizes.forEach((size) => (searchParams += `&storageSizes=${size}`));

  try {
    const response = await apiClient.get(`/v2/sale-items${searchParams}`);
    if (!response.ok) throw new Error("Failed to fetch sale items");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch sale items:", error);
  }
};
