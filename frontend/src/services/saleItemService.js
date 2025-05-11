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
		`${import.meta.env.VITE_API_BASE_URL}/brands`
	);
	return response.data.map((brand) => ({
		brandId: brand.id || brand.brandId,
		name: brand.name,
	}));
};
