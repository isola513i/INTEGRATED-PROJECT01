import { apiClient } from "@/services/httpClient";

export const addToCart = async (userId, saleItemId, quantity = 1) => {
  try {
    // เรียก backend: POST /itb-mshop/v2/cart/{userId}?saleItemId=xx&quantity=yy
    const res = await apiClient.postJson(
      `/v2/cart/${userId}?saleItemId=${saleItemId}&quantity=${quantity}`,
      null
    );

    if (!res.ok) throw new Error("Failed to add to cart");
    return true;
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};
export const getCartItemsByUser = async (userId) => {
  const response = await apiClient.get(`/v2/cart/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch cart");
  return await response.json();
};

export const setQuantity = async (userId, saleItemId, quantity) => {
  try {
    const res = await apiClient.putJson(
      `/v2/cart/${userId}?saleItemId=${saleItemId}&quantity=${quantity}`,
      null
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to update quantity: ${res.status} ${text}`);
    }
    return true;
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};
