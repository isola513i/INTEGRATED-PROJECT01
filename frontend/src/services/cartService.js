import { apiClient } from "@/services/httpClient";

// เพิ่มสินค้าลงตะกร้า / สร้าง cart item
export const addToCart = async (userId, saleItemId, quantity = 1) => {
  try {
    // POST /v2/cart/{userId}?saleItemId=xx&quantity=yy
    const res = await apiClient.postJson(
      `/v2/cart/${userId}?saleItemId=${saleItemId}&quantity=${quantity}`,
      null
    );

    if (!res.ok) throw new Error("Failed to add to cart");
    return { success: true };
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};

// ดึง cart items ของ user
export const getCartItemsByUser = async (userId) => {
  const res = await apiClient.get(`/v2/cart/${userId}`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch cart: ${res.status} ${text}`);
  }

  return await res.json();
};

// เปลี่ยนจำนวนสินค้าใน cart
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

    return { success: true };
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};

// อัปเดต address/note ของ cart
export const setDetail = async (userId, shippingAddress, note) => {
  try {
    const body = { shippingAddress, note };

    const res = await apiClient.putJson(`/v2/cart/${userId}/detail`, body);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to update cart detail: ${res.status} ${text}`);
    }

    return { success: true };
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};

// ดึง address/note ของ cart (ใช้กับ checkout หน้าแรก)
export const getCartDetail = async (userId) => {
  try {
    const res = await apiClient.get(`/v2/cart/${userId}/detail`);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to load cart detail: ${res.status} ${text}`);
    }
    return await res.json();
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};
