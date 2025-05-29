import { reactive, computed } from "vue";

export function useSaleItemValidator(form) {
	const errors = reactive({
		model: "",
		brandId: "",
		price: "",
		quantity: "",
		description: "",
		ramGb: "",
		screenSizeInch: "",
		storageGb: "",
		color: "",
	});

	const touched = reactive({
		model: false,
		brandId: false,
		price: false,
		quantity: false,
		description: false,
		ramGb: false,
		screenSizeInch: false,
		storageGb: false,
		color: false,
	});

	const validationUtils = {
		isNonEmptyString: (value) =>
			typeof value === "string" && value.trim() !== "",
		isInteger: (value) => /^\d+$/.test(String(value)),
		isPositiveInteger: (value) => /^[1-9]\d*$/.test(String(value)),
		isPositiveDecimal: (value) => {
			const num = parseFloat(value);
			return /^\d+(\.\d{1,2})?$/.test(value) && !isNaN(num) && num > 0;
		},
		isValidUrl: (value) => {
			try {
				new URL(value);
				return true;
			} catch {
				return false;
			}
		},
	};
	const validators = {
		model: () => {
			const value = form.model?.trim() || "";
			if (!validationUtils.isNonEmptyString(value))
				return "Model must be 1-60 characters long.";
			if (value.length > 60) return "Model must be 1-60 characters long.";
			return "";
		},
		brandId: () => (!form.brandId ? "Brand must be selected." : ""),
		description: () => {
			const value = form.description?.trim() || "";
			if (!validationUtils.isNonEmptyString(value))
				return "Description must be 1-16,384 characters long.";
			if (value.length > 16384)
				return "Description must be 1-16,384 characters long.";
			return "";
		},
		price: () => {
			const value = form.price;
			if (value === "" || value == null)
				return "Price must be non-negative integer.";
			if (!validationUtils.isInteger(value))
				return "Price must be non-negative integer.";
			return "";
		},
		quantity: () => {
			const value = form.quantity;
			if (value === "" || value == null)
				return "Quantity must be non-negative integer.";
			if (!validationUtils.isInteger(value))
				return "Quantity must be non-negative integer.";
			return "";
		},
		ramGb: () => {
			const value = form.ramGb;
			if (value === "" || value == null) return "";
			if (!validationUtils.isPositiveInteger(value))
				return "RAM size must be positive integer or not specified.";
			return "";
		},
		screenSizeInch: () => {
			const value = form.screenSizeInch;
			if (value === "" || value == null) return "";
			if (!validationUtils.isPositiveDecimal(value))
				return "Screen size must be positive number with at most 2 decimal points or not specified.";
			return "";
		},
		storageGb: () => {
			const value = form.storageGb;
			if (value === "" || value == null) return "";
			if (!validationUtils.isPositiveInteger(value))
				return "Storage size must be positive integer or not specified.";
			return "";
		},
		color: () => {
			const value = form.color?.trim() || "";
			if (value === "") return "";
			if (!validationUtils.isNonEmptyString(value))
				return "Color must be 1-40 characters long or not specified.";
			if (value.length > 40)
				return "Color must be 1-40 characters long or not specified.";
			return "";
		},
	};

	const validateField = (field) => {
		errors[field] = validators[field]();
	};

	const validateAll = () => {
		Object.keys(validators).forEach(validateField);
	};

	const isFormValid = computed(() => {
		return Object.values(errors).every((e) => e === "");
	});

	return {
		errors,
		touched,
		validateField,
		validateAll,
		isFormValid,
	};
}
