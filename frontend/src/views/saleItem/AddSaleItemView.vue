<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import SaleItemForm from "@/components/form/SaleItemForm.vue";
import { addSaleItem } from "@/services/saleItemService";
import { fetchBrands } from "@/services/brandService";
import { useFlashStore } from "@/store/useFlashStore";
import { useSaleItemValidator } from "@/validators/useValidation";

const router = useRouter();
const isSubmitting = ref(false);
const errorMessage = ref("");
const brands = ref([]);
const flash = useFlashStore();

const form = reactive({
	brandId: "",
	model: "",
	price: "",
	description: "",
	ramGb: "",
	screenSizeInch: "",
	storageGb: "",
	color: "",
	quantity: "",
});

const { errors, validateAll, isFormValid, validateField } =
	useSaleItemValidator(form);

const initialForm = reactive(JSON.parse(JSON.stringify(form)));

const sortedBrands = computed(() =>
	[...brands.value].sort((a, b) =>
		a.name.localeCompare(b.name, "en", { sensitivity: "base" })
	)
);

const requiredFields = ["brandId", "model", "price", "quantity", "description"];
const isDirty = computed(() => {
	const allRequiredChanged = requiredFields.every((field) => {
		return form[field] !== initialForm[field];
	});

	const allRequiredValid = requiredFields.every((field) => {
		const value = form[field];
		return (
			value !== null &&
			value !== "" &&
			(typeof value !== "string" || value.trim() !== "")
		);
	});

	return allRequiredChanged && allRequiredValid;
});

const isReadyToSubmit = computed(() => {
	return isFormValid.value && isDirty.value;
});

onMounted(async () => {
	try {
		brands.value = await fetchBrands();
	} catch (error) {
		errorMessage.value = "Failed to load brands";
	}
});

const updateForm = (updatedForm) => {
	Object.assign(form, updatedForm);
};

const handleSubmit = async () => {
	validateAll();

	if (!isFormValid.value) {
		errorMessage.value = "Please correct the form errors";
		return;
	}

	isSubmitting.value = true;
	errorMessage.value = "";

	try {
		const brandId = Number(form.brandId);
		const selectedBrand = brands.value.find(
			(b) => Number(b.brandId) === brandId
		);

		if (!selectedBrand) {
			throw new Error("Selected brand not found");
		}

		const payload = {
			model: form.model.trim(),
			brand: {
				id: brandId,
				name: selectedBrand.name,
			},
			description: form.description.trim(),
			price: Number(form.price),
			ramGb: form.ramGb ? Number(form.ramGb) : null,
			screenSizeInch: form.screenSizeInch ? Number(form.screenSizeInch) : null,
			quantity: Number(form.quantity),
			storageGb: form.storageGb ? Number(form.storageGb) : null,
			color: form.color?.trim() || null,
		};

		await addSaleItem(payload);

		flash.setMessage(
			"The sale item has been successfully added.",
			"itbms-message m-4 p-4 bg-green-100 text-green-800 shadow"
		);
		router.back();
	} catch (error) {
		handleSubmissionError(error);
	} finally {
		isSubmitting.value = false;
	}
};

const handleCancel = () => {
	router.back();
	resetForm();
};

const handleSubmissionError = (error) => {
	if (error.response) {
		errorMessage.value =
			error.response.data?.message || `Server error: ${error.response.status}`;
	} else if (error.request) {
		errorMessage.value =
			"No response from server. Please check your connection.";
	} else {
		errorMessage.value = error.message || "Failed to send request";
	}
	console.error("Submission error:", error);
};

const resetForm = () => {
	Object.assign(form, initialForm);
	errorMessage.value = "";
};
</script>

<template>
	<div class="p-10 max-w-7xl mx-auto text-gray-800">
		<div class="mb-8 flex items-center gap-2">
			<router-link
				to="/sale-items"
				class="text-gray-600 hover:text-black text-xl font-light itbms-home-button"
			>
				Home
			</router-link>
			<span class="text-gray-400">/</span>
			<span class="text-xl text-gray-800 font-light">New Sale Item</span>
		</div>

		<SaleItemForm
			:form="form"
			:brands="sortedBrands"
			:isSubmitting="isSubmitting"
			:isReadyToSubmit="isReadyToSubmit"
			:errors="errors"
			@update:form="updateForm"
			@submit="handleSubmit"
			@cancel="handleCancel"
			@blur="validateField"
		/>
	</div>
</template>
