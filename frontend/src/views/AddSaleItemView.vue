<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import SaleItemForm from "@/components/SaleItemForm.vue";
import { fetchBrands } from "@/services/saleItemService";

const router = useRouter();
const isSubmitting = ref(false);
const errorMessage = ref("");
const brands = ref([]);

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
		f.quantity > 0 &&
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
		const selectedBrand = brands.value.find(
			(b) => b.brandId === form.value.brandId
		);

		const payload = {
			brand: {
				id: form.value.brandId,
				name: selectedBrand?.name || "",
			},
			model: form.value.model.trim(),
			description: form.value.description.trim(),
			price: Number(form.value.price),
			ramGb: form.value.ramGb || null,
			screenSizeInch: form.value.screenSizeInch || null,
			quantity: Number(form.value.quantity),
			storageGb: form.value.storageGb || null,
			color: form.value.color?.trim() || null,
		};

		const response = await axios.post(
			`${import.meta.env.VITE_API_BASE_URL}/sale-items`,
			payload
		);

		if (response.status === 201) {
			router.push({
				path: "/sale-items",
				query: { successMessage: "The sale item has been successfully added" },
			});
		}
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message || "Failed to save item.";
	} finally {
		isSubmitting.value = false;
	}
};

const handleCancel = () => {
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
				class="text-gray-600 hover:text-black text-xl font-light"
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
