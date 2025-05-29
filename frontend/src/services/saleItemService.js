
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSaleItems = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/sale-items`);
  if (!response.ok) throw new Error("Failed to fetch sale items");
  return await response.json();
};

export const fetchItemById = async (saleItemId) => {
  const response = await fetch(`${API_BASE_URL}/v1/sale-items/${saleItemId}`);
  if (!response.ok) throw new Error("Failed to fetch item");
  return await response.json();
};

export const deleteItemById = async (saleItemId) => {
  const response = await fetch(`${API_BASE_URL}/v1/sale-items/${saleItemId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete item");
  return true;
};

export const fetchSaleItemsV2 = async (
  filterBrands = [],
  page,
  size = 10,
  sortField,
  sortDirection = "asc",
) => {
  if (page === undefined || page === null) {
    throw new Error('Parameter "page" is required and cannot be undefined');
  }

  let searchParams = `?page=${page}&size=${size}`;
  if (sortField) searchParams += `&sortField=${sortField}`;
  if (sortDirection) searchParams += `&sortDirection=${sortDirection}`;
  filterBrands.forEach((brand) => (searchParams += `&filterBrands=${brand}`));

  try {
    const response = await fetch(`${API_BASE_URL}/v2/sale-items${searchParams}`);
    if (!response.ok) throw new Error("Failed to fetch sale items");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch sale items:", error);
  }
};

