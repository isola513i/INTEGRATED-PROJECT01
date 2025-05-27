import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSaleItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/v1/sale-items`);
  return response.data;
};

export const fetchItemById = async (saleItemId) => {
  const response = await axios.get(
    `${API_BASE_URL}/v1/sale-items/${saleItemId}`,
  );
  return response.data;
};

export const deleteItemById = async (saleItemId) => {
  const response = await axios.delete(
    `${API_BASE_URL}/v1/sale-items/${saleItemId}`,
  );
  return response.data;
};

export const fetchSaleItemsV2 = async (
  filterBrands = [],
  page,
  size = 10,
  sortField,
  sortDirection = "asc",
) => {
  let searchParams = `?page=${page}&size=${size}`; // เปลี่ยนชื่อจาก params เป็น searchParams

  if (page === undefined || page === null) {
    throw new Error('Parameter "page" is required and cannot be undefined');
  }

  if (sortField) searchParams += `&sortField=${sortField}`;
  if (sortDirection) searchParams += `&sortDirection=${sortDirection}`;
  filterBrands.forEach((brand) => (searchParams += `&filterBrands=${brand}`));

  try {
    const response = await axios.get(
      `${API_BASE_URL}/v2/sale-items${searchParams}`,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sale items:", error);
  }
};
