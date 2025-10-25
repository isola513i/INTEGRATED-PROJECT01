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

export async function fetchOrdersBySeller(
	sellerId,
	{ status = "all", page = 0, size = 10 }
) {
	const params = new URLSearchParams({ status, page, size });
	const res = await apiClient.get(`/v2/sellers/${sellerId}/orders?${params}`);

	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || "Failed to fetch seller orders");
	}
	return await res.json();
}

export async function fetchSellerOrderDetail(sellerId, orderId) {
	const res = await apiClient.get(`/v2/sellers/${sellerId}/orders/${orderId}`);
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || "Failed to fetch seller order details");
	}
	return await res.json();
}

export async function fetchNewOrderCount(sellerId) {
	const params = new URLSearchParams({ status: "new", page: 0, size: 0 });
	const res = await apiClient.get(`/v2/sellers/${sellerId}/orders?${params}`);
	if (!res.ok) {
		console.error("Failed to fetch new order count");
		return 0;
	}
	const pageData = await res.json();
	return pageData?.totalElements ?? 0;
}
