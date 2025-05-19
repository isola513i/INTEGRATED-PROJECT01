import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSaleItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/sale-items`);
  return await response.data;
};

export const fetchItemById = async (saleItemId) => {
  const response = await axios.get(`${API_BASE_URL}/sale-items/${saleItemId}`);
  return await response.data;
};

export const fetchBrands = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/brands`,
  );
  return response.data.map((brand) => ({
    brandId: brand.id || brand.brandId,
    name: brand.name,
  }));
};
export const deleteBrandById = async (brandId) =>{
  const response = await axios.delete(
    `${API_BASE_URL}/brands/${brandId}`
  )
  return response.data
}

export const deleteItemById = async (saleItemId) => {
  const response = await axios.delete(
    `${API_BASE_URL}/sale-items/${saleItemId}`,
  );
  return response.data;
};

export const addBrand = async (brand) =>{
  const res = await axios.post(
    `${API_BASE_URL}/brands`,brand,{
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
			validateStatus: function (status) {
				return status < 500;
			}
})
  return res
}

export const fetchBrandById = async (brandId) => {
   const response = await axios.get(`${API_BASE_URL}/brands/${brandId}`);
  return response;
}
export const updateBrand = async (brandId, brand) => {
  const res = await axios.put(
    `${API_BASE_URL}/brands/${brandId}`,
    brand,
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      validateStatus: function (status) {
        return status < 500; // Accept only responses < 500
      },
    }
  );
  return res;
};