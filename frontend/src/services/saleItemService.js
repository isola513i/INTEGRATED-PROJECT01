import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSaleItems = async () => {
	const response = await axios.get(`${API_BASE_URL}/sale-items`);
	return response.data;
};

export const fetchItemById = async (saleItemId) => {
	const response = await axios.get(`${API_BASE_URL}/sale-items/${saleItemId}`);
	return response.data;
};

export const deleteItemById = async (saleItemId) => {
	const response = await axios.delete(
		`${API_BASE_URL}/sale-items/${saleItemId}`
	);
	return response.data;
};

