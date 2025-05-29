const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchBrands = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/brands`);
  if (!response.ok) throw new Error("Failed to fetch brands");
  const data = await response.json();
  return data.map((brand) => ({
    brandId: brand.id || brand.brandId,
    name: brand.name,
  }));
};

export const fetchBrandById = async (brandId) => {
  const response = await fetch(`${API_BASE_URL}/v1/brands/${brandId}`);
  if (!response.ok) throw new Error("Failed to fetch brand");
  return await response.json();
};

export const addBrand = async (brand) => {
   try {
      const res = await fetch(`${API_BASE_URL}/v1/brands`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(brand),
      });

      if (!res.ok) throw new Error('Failed to create new brand')

      return await res.json();
   } catch (error) {
      console.error('API error:', error);
      return { success: false, error };
   }
};

export const updateBrand = async (brandId, brand) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}/v1/brands/${brandId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(brand),
      signal: controller.signal,
    });

    if (response.status >= 500) throw new Error("Server error");

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

export const deleteBrandById = async (brandId) => {
  const response = await fetch(`${API_BASE_URL}/v1/brands/${brandId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete brand");
  return true;
};