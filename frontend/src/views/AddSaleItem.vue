<template>
	<div class="p-4 max-w-2xl mx-auto text-gray-800">
		<router-link
			to="/"
			class="mb-4 inline-block text-blue-600 hover:text-blue-800"
		>
			← Home
		</router-link>

		<button
			v-if="!showForm"
			@click="showForm = true"
			class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
		>
			Add Sale Item
		</button>

		<form
			v-if="showForm"
			@submit.prevent="handleSubmit"
			class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
		>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Brand Dropdown -->
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">
						Brand *
					</label>
					<select
						v-model="form.brandId"
						class="w-full px-3 py-2 border rounded"
						required
					>
						<option value="" disabled>Select a brand</option>
						<option
							v-for="brand in sortedBrands"
							:key="brand.brandId"
							:value="brand.brandId"
						>
							{{ brand.name }}
						</option>
					</select>
				</div>

				<!-- Model -->
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">
						Model *
					</label>
					<input
						type="text"
						v-model.trim="form.model"
						@blur="form.model = form.model.trim()"
						class="w-full px-3 py-2 border rounded"
						required
					/>
				</div>

				<!-- Price -->
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">
						Price *
					</label>
					<input
						type="number"
						v-model.number="form.price"
						class="w-full px-3 py-2 border rounded"
						min="0"
						step="0.01"
						required
					/>
				</div>

				<!-- Quantity -->
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">
						Quantity *
					</label>
					<input
						type="number"
						v-model.number="form.quantity"
						class="w-full px-3 py-2 border rounded"
						min="0"
						required
					/>
				</div>

				<!-- Description -->
				<div class="mb-4 col-span-full">
					<label class="block text-gray-700 text-sm font-bold mb-2">
						Description *
					</label>
					<textarea
						v-model.trim="form.description"
						@blur="form.description = form.description.trim()"
						class="w-full px-3 py-2 border rounded"
						rows="3"
						required
					></textarea>
				</div>

				<!-- Optional Fields -->
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">
						RAM (GB) (Optional)
					</label>
					<input
						type="number"
						placeholder="GB"
						v-model.trim="form.ramGb"
						@blur="form.ramGb = form.ramGb"
						class="w-full px-3 py-2 border rounded"
						min="0"
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">
						Screen Size (Optional)
					</label>
					<input
						type="number"
						placeholder="Inches"
						v-model.trim="form.screenSizeInch"
						@blur="form.screenSize = form.screenSizeInch"
						class="w-full px-3 py-2 border rounded"
						step="0.1"
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">
						Storage (Optional)
					</label>
					<input
						type="number"
						placeholder="GB"
						v-model.trim="form.storageGb"
						@blur="form.storage = form.storageGb"
						class="w-full px-3 py-2 border rounded"
						min="0"
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">
						Color (Optional)
					</label>
					<input
						type="text"
						v-model.trim="form.color"
						@blur="form.color = form.color.trim()"
						class="w-full px-3 py-2 border rounded"
					/>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<button
					type="submit"
					:disabled="!isFormValid || isSubmitting"
					class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
					:class="{
						'opacity-50 cursor-not-allowed': !isFormValid || isSubmitting,
						'hover:bg-blue-600': isFormValid && !isSubmitting,
					}"
				>
					{{ isSubmitting ? "Saving..." : "Save" }}
				</button>

				<button
					type="button"
					@click="handleCancel"
					class="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
				>
					Cancel
				</button>
			</div>

			<div v-if="errorMessage" class="mt-4 text-red-500">
				{{ errorMessage }}
			</div>
		</form>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { fetchBrands } from "@/services/saleItemService.js";

const router = useRouter();
const showForm = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const brands = ref([]);

const form = ref({
	brandId: "", // ✅ ตรงกับ v-model ใน dropdown
	model: "",
	price: null,
	description: "",
	ramGb: null, // ✅ ตรงกับ DTO
	screenSizeInch: null,
	storageGb: null,
	color: "",
	quantity: null,
});

const sortedBrands = computed(() => {
	return [...brands.value].sort((a, b) => a.name.localeCompare(b.name));
});

const isFormValid = computed(() => {
	return (
		form.value.brandId && // ตรวจสอบ brandId แทน brand
		form.value.model &&
		form.value.price > 0 &&
		form.value.description &&
		form.value.quantity > 0
	);
});

onMounted(async () => {
	try {
		brands.value = await fetchBrands();
	} catch (error) {
		console.error("Error fetching brands:", error);
		errorMessage.value = "Failed to load brands";
	}
});

const selectedBrand = brands.value.find(
	(brand) => brand.brandId === form.value.brandId
);

const handleSubmit = async () => {
	isSubmitting.value = true;
	errorMessage.value = "";

	try {
		const payload = {
			brand: {
				id: form.value.brandId,
				name: selectedBrand?.name || "",
			},
			model: form.value.model.trim(),
			price: Number(form.value.price),
			description: form.value.description.trim(),
			ramGb: form.value.ramGb || null,
			screenSizeInch: form.value.screenSizeInch || null,
			storageGb: form.value.storageGb || null,
			color: form.value.color?.trim() || null,
			quantity: Number(form.value.quantity),
		};

		console.log("Payload:", payload);

		const response = await axios.post(
			`${import.meta.env.VITE_API_BASE_URL}/sale-items`,
			payload
		);

		if (response.status === 201) {
			router.push({
				path: "/",
				query: { successMessage: "The sale item has been successfully added" },
			});
		}
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ||
			"Failed to save sale item. Please try again.";
	} finally {
		isSubmitting.value = false;
	}
};

const handleCancel = () => {
	showForm.value = false;
	resetForm();
};

const resetForm = () => {
	form.value = {
		brandId: "", // แก้ให้ตรงกับ initial state
		model: "",
		price: null,
		description: "",
		ramGb: null,
		screenSizeInch: null,
		storageGb: null,
		color: "",
		quantity: null,
	};
};
</script>
