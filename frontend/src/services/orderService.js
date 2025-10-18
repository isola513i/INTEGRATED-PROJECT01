// src/services/orderService.js
import { apiClient } from "@/services/httpClient";

export async function placeOrder(payload) {
	const res = await apiClient.postJson(`/v2/orders`, payload);

	if (res.status === 409) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || "Quantity Not Enough");
	}

	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || "Failed to place order");
	}

	return await res.json();
}

export async function fetchOrdersByBuyer(userId, { page = 0, size = 10 }) {
	const params = new URLSearchParams({ page, size });
	const res = await apiClient.get(`/v2/users/${userId}/orders?${params}`);

	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || "Failed to fetch orders");
	}

	return await res.json();
}

export async function fetchOrderDetail(orderId) {
	const res = await apiClient.get(`/v2/orders/${orderId}`);
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || "Failed to fetch order details");
	}
	return await res.json();
}
