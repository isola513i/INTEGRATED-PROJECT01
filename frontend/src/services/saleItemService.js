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

export const addSaleItem = async (formData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/sale-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData
    });

    if (!res.ok) throw new Error("Failed to create new sale item");

    return await res.json();
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};

export const updateSaleItem = async (saleItemId, saleItem) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/sale-items/${saleItemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleItem),
        signal: controller.signal,
      }
    );

    if (response.status >= 500) throw new Error("Server error");

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
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
  storageSizes = [],
  minPrice,
  maxPrice
) => {
  if (page === undefined || page === null) {
    throw new Error('Parameter "page" is required and cannot be undefined');
  }

  let searchParams = `?page=${page}&size=${size}`;
  if (sortField) searchParams += `&sortField=${sortField}`;
  if (sortDirection) searchParams += `&sortDirection=${sortDirection}`;
  if (minPrice) searchParams += `&lowerPrice=${minPrice}`;
  if (maxPrice) searchParams += `&upperPrice=${maxPrice}`;

  filterBrands.forEach((brand) => (searchParams += `&filterBrands=${brand}`));
  storageSizes.forEach((size) => (searchParams += `&storageSizes=${size}`));

  try {
    const response = await fetch(
      `${API_BASE_URL}/v2/sale-items${searchParams}`
    );
    if (!response.ok) throw new Error("Failed to fetch sale items");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch sale items:", error);
  }
};
