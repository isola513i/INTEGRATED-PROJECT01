const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (response) => {
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Something went wrong");
	}
	return response.json();
};

export const fetchSaleItems = async () => {
	const response = await fetch(`${API_BASE_URL}/v1/sale-items`);
	return handleResponse(response);
};

export const fetchItemById = async (saleItemId) => {
	const response = await fetch(`${API_BASE_URL}/v1/sale-items/${saleItemId}`);
	return handleResponse(response);
};

export const addSaleItem = async (payload) => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 10000);

	try {
		const response = await fetch(`${API_BASE_URL}/v1/sale-items`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);
		return handleResponse(response);
	} catch (error) {
		clearTimeout(timeoutId);
		throw error;
	}
};

export const updateSaleItem = async (saleItemId, payload) => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 10000);

	try {
		const response = await fetch(
			`${API_BASE_URL}/v1/sale-items/${saleItemId}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
				signal: controller.signal,
			}
		);

		clearTimeout(timeoutId);
		return handleResponse(response);
	} catch (error) {
		clearTimeout(timeoutId);
		throw error;
	}
};

export const deleteItemById = async (saleItemId) => {
	const response = await fetch(`${API_BASE_URL}/v1/sale-items/${saleItemId}`, {
		method: "DELETE",
	});
	return handleResponse(response);
};

export const fetchSaleItemsV2 = async (
	filterBrands = [],
	page,
	size = 10,
	sortField,
	sortDirection = "asc"
) => {
	if (page === undefined || page === null) {
		throw new Error('Parameter "page" is required and cannot be undefined');
	}

	let searchParams = `?page=${page}&size=${size}`;
	if (sortField) searchParams += `&sortField=${sortField}`;
	if (sortDirection) searchParams += `&sortDirection=${sortDirection}`;
	filterBrands.forEach((brand) => {
		searchParams += `&filterBrands=${encodeURIComponent(brand)}`;
	});

	try {
		const response = await fetch(
			`${API_BASE_URL}/v2/sale-items${searchParams}`
		);
		return handleResponse(response);
	} catch (error) {
		console.error("Failed to fetch sale items:", error);
		throw error;
	}
};
