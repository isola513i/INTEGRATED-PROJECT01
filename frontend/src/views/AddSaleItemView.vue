<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import SaleItemForm from "@/components/SaleItemForm.vue";
import { fetchBrands } from "@/services/saleItemService";
import { useFlashStore } from "@/store/useFlashStore";

const router = useRouter();
const isSubmitting = ref(false);
const errorMessage = ref("");
const brands = ref([]);
const flash = useFlashStore()

const form = ref({
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

const sortedBrands = computed(() => {
	return [...brands.value].sort((a, b) =>
		a.name.localeCompare(b.name, "en", { sensitivity: "base" })
	);
});

const initialForm = ref({ ...form.value });
const isDirty = computed(() => {
	return JSON.stringify(form.value) !== JSON.stringify(initialForm.value);
});

const isFormValid = computed(() => {
	const f = form.value;
	return (
		!!f.brandId &&
		f.model.trim().length > 0 &&
		f.price > 0 &&
		f.description.trim().length > 0
	);
});

onMounted(async () => {
	try {
		brands.value = await fetchBrands();
	} catch (error) {
		errorMessage.value = "Failed to load brands";
	}
});

const updateForm = (updatedForm) => {
	form.value = updatedForm;
};

const handleSubmit = async () => {
	isSubmitting.value = true;
	errorMessage.value = "";

	try {
		if (!form.value.brandId) {
			throw new Error("Please select a brand");
		}

		const brandId = parseInt(form.value.brandId, 10);

		if (isNaN(brandId)) {
			throw new Error("Invalid brand ID format");
		}

		const selectedBrand = brands.value.find((b) => {
			return Number(b.brandId) === brandId;
		});

		if (!selectedBrand) {
			throw new Error(`Brand with ID ${brandId} not found`);
		}

		const payload = {
			model: form.value.model.trim(),
			brand: {
				id: brandId,
				name: selectedBrand.name,
			},
			description: form.value.description.trim(),
			price: Number(form.value.price),
			ramGb: form.value.ramGb !== null ? Number(form.value.ramGb) : null,
			screenSizeInch:
				form.value.screenSizeInch !== null
					? Number(form.value.screenSizeInch)
					: null,
			quantity: Number(form.value.quantity),
			storageGb:
				form.value.storageGb !== null ? Number(form.value.storageGb) : null,
			color: form.value.color?.trim() || null,
		};

		const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/sale-items`;

		const response = await axios.post(apiUrl, payload, {
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
			validateStatus: function (status) {
				return status < 500;
			},
		});

		if (response.status === 201) {
			flash.setMessage(
        	"The sale item has been successfully added.",
        	"itbms-message m-4 p-4 bg-green-100 text-green-800 shadow "

      );
	  router.back()
			// router.push({
			// 	path: "/sale-items",
			// 	query: { successMessage: "The sale item has been successfully added." },
			// });
		} else {
			errorMessage.value = `Unexpected response: ${response.status} ${response.statusText}`;
		}
	} catch (error) {
		if (error.response) {
			errorMessage.value =
				error.response.data?.message ||
				`Server error: ${error.response.status}`;
		} else if (error.request) {
			errorMessage.value =
				"No response from server. Please check your connection.";
		} else {
			errorMessage.value = error.message || "Failed to send request";
		}
	} finally {
		isSubmitting.value = false;
	}
};

const handleCancel = () => {
	router.push("/sale-items");
	const emptyForm = {
		brandId: "",
		model: "",
		price: null,
		description: "",
		ramGb: null,
		screenSizeInch: null,
		storageGb: null,
		color: "",
		quantity: null,
	};

	form.value = emptyForm;
	initialForm.value = { ...emptyForm };
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
			:isFormValid="isFormValid"
			:isDirty="isDirty"
			@update:form="updateForm"
			@submit="handleSubmit"
			@cancel="handleCancel"
		/>
	</div>
</template>
