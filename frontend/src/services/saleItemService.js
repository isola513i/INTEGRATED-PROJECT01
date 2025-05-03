import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSaleItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/v1/sale-items`);
  return await response.data;
};

export const fetchItembyId = async (saleItemId) => {
  const response = await axios.get(`${API_BASE_URL}/sale-items/${saleItemId}`);
  return await response.data;
};
