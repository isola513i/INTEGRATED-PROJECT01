// src/services/orderService.js
import { apiClient } from "@/services/httpClient";

export async function placeOrder(payload, userId) {
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
