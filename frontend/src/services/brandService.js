import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchBrands = async () => {
	const response = await axios.get(`${API_BASE_URL}/v1/brands`);
	return response.data.map((brand) => ({
		brandId: brand.id || brand.brandId,
		name: brand.name,
	}));
  
export const fetchBrandById = async (brandId) => {
	const response = await axios.get(`${API_BASE_URL}/v1/brands/${brandId}`);
	return response.data;
};

export const addBrand = async (brand) => {
	return await axios.post(`${API_BASE_URL}/v1/brands`, brand, {
		headers: {
			"Content-Type": "application/json",
		},
		timeout: 10000,
		validateStatus: (status) => status < 500,
	});
};

export const updateBrand = async (brandId, brand) => {
	return await axios.put(`${API_BASE_URL}/brands/${brandId}`, brand, {
		headers: {
			"Content-Type": "application/json",
		},
		timeout: 10000,
		validateStatus: (status) => status < 500,
	});
};

export const deleteBrandById = async (brandId) => {
	const response = await axios.delete(`${API_BASE_URL}/brands/${brandId}`);
	return response.data;
};
