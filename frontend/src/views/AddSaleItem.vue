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

const handleSubmit = async () => {
	isSubmitting.value = true;
	errorMessage.value = "";

	try {
		const selectedBrand = brands.value.find(
			(brand) => brand.brandId === form.value.brandId
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

		console.log("Payload:", payload);

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
		console.error("❌ ERROR:", error);
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
<template>
	<div class="p-10 max-w-7xl mx-auto text-gray-800">
		<!-- Minimalist Luxury Header -->
		<div class="mb-8 flex items-center gap-2">
			<router-link
				id="itbms-home-button"
				to="/sale-items"
				class="text-gray-600 hover:text-black text-xl font-light transition duration-300"
			>
				Home
			</router-link>
			<span class="text-gray-400">/</span>
			<span class="text-xl text-gray-800 font-light">New Sale Item</span>
		</div>

		<!-- Main Form -->
		<form
			@submit.prevent="handleSubmit"
			class="bg-white p-10 rounded-xl shadow-lg grid grid-cols-12 gap-8"
		>
			<!-- Image Section -->
			<div class="col-span-4 flex flex-col items-center">
				<!-- Large Picture Box -->
				<div
					class="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-lg text-gray-400 rounded-lg mb-6 border border-dashed"
				>
					No Picture
				</div>

				<!-- Thumbnails -->
				<div class="grid grid-cols-4 gap-x-4">
					<div
						v-for="n in 4"
						:key="n"
						class="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center text-xs text-gray-400 border hover:border-blue-400 transition"
					>
						+
					</div>
				</div>
			</div>

			<!-- Form Fields -->
			<div class="col-span-8 grid grid-cols-2 gap-6">
				<!-- Brand -->
				<div>
					<label
						class="block mb-1 font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"
						>Brand</label
					>
					<select
						id="itbms-brand"
						v-model="form.brandId"
						class="w-full border px-4 py-2 rounded"
						required
					>
						<option value="" disabled>Select brand</option>
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
				<div>
					<label
						class="block mb-1 font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"
						>Model</label
					>
					<input
						id="itbms-model"
						type="text"
						v-model="form.model"
						class="w-full border px-4 py-2 rounded"
						required
					/>
				</div>

				<!-- Price -->
				<div>
					<label
						class="block mb-1 font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"
						>Price (Baht)</label
					>
					<input
						id="itbms-price"
						type="number"
						v-model.number="form.price"
						min="0"
						class="w-full border px-4 py-2 rounded"
						required
					/>
				</div>

				<!-- Quantity -->
				<div>
					<label
						class="block mb-1 font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"
						>Quantity</label
					>
					<input
						id="itbms-quantity"
						type="number"
						v-model.number="form.quantity"
						class="w-full border px-4 py-2 rounded"
						min="0"
						required
					/>
				</div>

				<!-- Description -->
				<div class="col-span-2">
					<label
						class="block mb-1 font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"
						>Description</label
					>
					<textarea
						id="itbms-description"
						v-model="form.description"
						class="w-full border px-4 py-2 rounded"
						rows="3"
						required
					></textarea>
				</div>

				<!-- RAM -->
				<div>
					<label class="block mb-1 font-medium text-gray-700">RAM (GB)</label>
					<input
						id="itbms-ramGb"
						type="number"
						v-model.number="form.ramGb"
						class="w-full border px-4 py-2 rounded"
					/>
				</div>

				<!-- Screen Size -->
				<div>
					<label class="block mb-1 font-medium text-gray-700"
						>Screen Size (Inch)</label
					>
					<input
						id="itbms-screenSizeInch"
						type="number"
						step="0.1"
						v-model.number="form.screenSizeInch"
						class="w-full border px-4 py-2 rounded"
					/>
				</div>

				<!-- Storage -->
				<div>
					<label class="block mb-1 font-medium text-gray-700"
						>Storage (GB)</label
					>
					<input
						id="itbms-storageGb"
						type="number"
						v-model.number="form.storageGb"
						class="w-full border px-4 py-2 rounded"
					/>
				</div>

				<!-- Color -->
				<div>
					<label class="block mb-1 font-medium text-gray-700">Color</label>
					<input
						id="itbms-color"
						type="text"
						v-model="form.color"
						class="w-full border px-4 py-2 rounded"
					/>
				</div>
			</div>

			<!-- Save/Cancel Buttons -->
			<div class="col-span-12 flex justify-center gap-6 mt-10">
				<button
					id="itbms-save-button"
					type="submit"
					:disabled="!isFormValid || isSubmitting"
					class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{{ isSubmitting ? "Saving..." : "Save" }}
				</button>

				<button
					id="itbms-cancel-button"
					type="button"
					@click="handleCancel"
					class="border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-gray-100 transition"
				>
					Cancel
				</button>
			</div>
		</form>
	</div>
</template>
