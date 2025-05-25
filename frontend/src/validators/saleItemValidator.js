export const validateSaleItemField = (field, value) => {
	switch (field) {
		case "brandId":
			return value ? "" : "Brand is required";

		case "model":
			if (!value || typeof value !== "string" || value.trim().length === 0) {
				return "Model is required";
			}
			if (value.trim().length > 50) {
				return "Model must be ≤ 50 characters";
			}
			return "";

		case "price":
			if (value === "" || value === null || isNaN(Number(value))) {
				return "Price is required";
			}
			if (Number(value) < 1) {
				return "Price must be at least 1";
			}
			return "";

		case "quantity":
			if (value === "" || value === null || isNaN(Number(value))) {
				return "Quantity is required";
			}
			if (Number(value) < 1) {
				return "Quantity must be at least 1";
			}
			if (!Number.isInteger(Number(value))) {
				return "Quantity must be an integer";
			}
			return "";

		case "description":
			if (!value || typeof value !== "string" || value.trim().length === 0) {
				return "Description is required";
			}
			if (value.trim().length > 255) {
				return "Description must be ≤ 255 characters";
			}
			return "";

		default:
			return "";
	}
};

export const validateSaleItemForm = (form) => {
	const errors = {};

	for (const key of Object.keys(form)) {
		const error = validateSaleItemField(key, form[key]);
		if (error) {
			errors[key] = error;
		}
	}

	return errors;
};

export const isFormValid = (errors) => {
	return Object.values(errors).every((e) => e === "");
};
