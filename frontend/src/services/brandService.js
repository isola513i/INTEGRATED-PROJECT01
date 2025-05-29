const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// GET /v1/brands
export const fetchBrands = async () => {
	const response = await fetch(`${API_BASE_URL}/v1/brands`);
	if (!response.ok) throw new Error("Failed to fetch brands");
	const data = await response.json();
	return data.map((brand) => ({
		brandId: brand.id || brand.brandId,
		name: brand.name,
	}));
};

// GET /v1/brands/:brandId
export const fetchBrandById = async (brandId) => {
	const response = await fetch(`${API_BASE_URL}/v1/brands/${brandId}`);
	if (!response.ok) throw new Error("Failed to fetch brand");
	return await response.json();
};

// POST /v1/brands
export const addBrand = async (brand) => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10000);

	const response = await fetch(`${API_BASE_URL}/v1/brands`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(brand),
		signal: controller.signal,
	});

	clearTimeout(timeout);

	if (!response.ok && response.status >= 500) {
		throw new Error(`Server error: ${response.status}`);
	}

	return await response.json();
};

// PUT /v1/brands/:brandId
export const updateBrand = async (brandId, brand) => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10000);

	const response = await fetch(`${API_BASE_URL}/v1/brands/${brandId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(brand),
		signal: controller.signal,
	});

	clearTimeout(timeout);

	if (!response.ok && response.status >= 500) {
		throw new Error(`Server error: ${response.status}`);
	}

	return await response.json();
};

// DELETE /v1/brands/:brandId
export const deleteBrandById = async (brandId) => {
	const response = await fetch(`${API_BASE_URL}/v1/brands/${brandId}`, {
		method: "DELETE",
	});

	if (!response.ok) throw new Error("Failed to delete brand");

	return await response.json();
};
