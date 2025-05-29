<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SaleItemForm from "@/components/form/SaleItemForm.vue";
import { fetchItemById, updateSaleItem } from "@/services/saleItemService";
import { fetchBrands } from "@/services/brandService";
import { useFlashStore } from "@/store/useFlashStore";
import { useSaleItemValidator } from "@/validators/useValidation";

const router = useRouter();
const initProd = ref();
const route = useRoute();
const isUpdate = ref(false); //
const isSubmitting = ref(false);
const errorMessage = ref("");
const brands = ref([]);
const flash = useFlashStore();

const form = reactive({
	brandId: "",
	model: "",
	price: null,
	description: "",
	ramGb: null,
	screenSizeInch: null,
	storageGb: null,
	color: "",
	quantity: null,
});

const { errors, validateAll, isFormValid, validateField } =
	useSaleItemValidator(form);

const initialForm = reactive(JSON.parse(JSON.stringify(form)));
const requiredFields = ["brandId", "model", "price", "quantity", "description"];

Object.keys(form).forEach((field) => {
	watch(
		() => form[field],
		() => {
			validateField(field);
			checkFormUpdate();
		}
	);
});

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
	return isFormValid.value && isDirty.value && isUpdate.value;
});

const checkFormUpdate = () => {
	isUpdate.value = JSON.stringify(form) !== JSON.stringify(initProd.value);
};

onMounted(async () => {
	try {
		brands.value = await fetchBrands();
		const data = await fetchItemById(route.params.id);
		DataToForm(data);
		initProd.value = JSON.parse(JSON.stringify(form));
	} catch (error) {
		errorMessage.value = "Failed to load data";
		console.error("Loading error:", error);
	}
});

const DataToForm = (data) => {
	Object.assign(form, {
		brandId: brands.value.find((b) => b.name === data.brandName)?.brandId || "",
		model: data.model || "",
		price: data.price ?? null,
		description: data.description || "",
		ramGb: data.ramGb ?? null,
		screenSizeInch: data.screenSizeInch ?? null,
		storageGb: data.storageGb ?? null,
		color: data.color || "",
		quantity: data.quantity ?? null,
	});
};

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
		if (!form.brandId) {
			throw new Error("Please select a brand");
		}

		const brandId = parseInt(form.brandId, 10);
		if (isNaN(brandId)) {
			throw new Error("Invalid brand ID format");
		}

		const selectedBrand = brands.value.find(
			(b) => Number(b.brandId) === brandId
		);
		if (!selectedBrand) {
			throw new Error(`Brand with ID ${brandId} not found`);
		}

		const payload = {
			model: form.model.trim(),
			brand: {
				id: brandId,
				name: selectedBrand.name,
			},
			description: form.description.trim(),
			price: Number(form.price),
			ramGb: form.ramGb !== null ? Number(form.ramGb) : null,
			screenSizeInch:
				form.screenSizeInch !== null ? Number(form.screenSizeInch) : null,
			quantity: Number(form.quantity),
			storageGb: form.storageGb !== null ? Number(form.storageGb) : null,
			color: form.color?.trim() || null,
		};

		await updateSaleItem(route.params.id, payload);

		flash.setMessage(
			"✅ The sale item has been updated.",
			"m-4 p-4 bg-green-100 text-green-800 shadow itbms-message"
		);
		router.back();
	} catch (error) {
		handleSubmissionError(error);
	} finally {
		isSubmitting.value = false;
	}
};

const handleSubmissionError = (error) => {
	if (error.name === "AbortError") {
		errorMessage.value = "Request timed out.";
	} else {
		errorMessage.value = error.message || "Failed to send request";
	}
	console.error("Submission error:", error);
};

const handleCancel = () => {
	router.push("/sale-items");
	resetForm();
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
				class="itbms-home-button text-gray-600 hover:text-black text-xl font-light"
				>Home</router-link
			>
			<span class="text-gray-400">/</span>
			<button
				@click="router.back()"
				class="itbms-home-button text-gray-600 hover:text-black text-xl font-light"
			>
				back
			</button>
		</div>

		<div v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</div>

		<SaleItemForm
			v-if="form"
			:updatePage="true"
			:isUpdate="isUpdate"
			:form="form"
			:brands="brands"
			:isSubmitting="isSubmitting"
			:isReadyToSubmit="isReadyToSubmit"
			:errors="errors"
			@update:form="updateForm"
			@submit="handleSubmit"
			@cancel="handleCancel"
		/>
	</div>
</template>
