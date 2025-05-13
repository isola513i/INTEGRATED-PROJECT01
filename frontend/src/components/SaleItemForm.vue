<script setup>
const props = defineProps({
	updatePage: {
		type: Boolean,
		default: false, 
	},
	isupdate: Boolean,
	form: Object,
	brands: Array,
	isSubmitting: Boolean,
	isFormValid: Boolean,
	isDirty: Boolean,
});
const emit = defineEmits(["update:form", "submit", "cancel", "blur"]);

const updateField = (field, value) => {
	if (field === "brandId") {
		console.log(`Selected brandId: ${value}, type: ${typeof value}`);
	}
	emit("update:form", { ...props.form, [field]: value });
};

const trimField = (field, value) => {
	emit("update:form", { ...props.form, [field]: value.trim() });
	emit("blur", field);
};
</script>

<template>
	<form
		@submit.prevent="$emit('submit')"
		class="grid grid-cols-12 gap-8 bg-white p-10 rounded-xl shadow-lg"
	>
		<!-- Picture Upload -->
		<div class="col-span-4">
			<div
				class="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-lg text-gray-400 rounded-lg mb-6 border border-dashed"
			>
				No Picture
			</div>
			<div class="grid grid-cols-4 gap-4">
				<div
					v-for="n in 4"
					:key="n"
					class="w-16 h-16 bg-gray-50 text-xs text-gray-400 border flex justify-center items-center rounded-lg"
				>
					+
				</div>
			</div>
		</div>

		<!-- Product Form Fields -->
		<div class="col-span-8 grid grid-cols-2 gap-6">
			<!-- Brand -->
			<div>
				<label
					class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
				>
					Brand
				</label>
				<select
					:value="props.form.brandId"
					@change="updateField('brandId', Number($event.target.value) || '')"
					class="itbms-brand w-full border px-4 py-2 rounded"
				>
					<option value="" disabled>Select brand</option>
					<option
						v-for="brand in brands"
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
					class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
				>
					Model
				</label>
				<input
					type="text"
					:value="props.form.model"
					@input="updateField('model', $event.target.value)"
					@blur="trimField('model', $event.target.value)"
					class="itbms-model w-full border px-4 py-2 rounded"
				/>
			</div>

			<!-- Price -->
			<div v-if="!updatePage">
				<label
					class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
				>
					Price
				</label>
				<input
					type="number"
					min="0"
					step="1"
					:value="props.form.price"
					@input="
						updateField('price', Math.max(1, Number($event.target.value)))
					"
					class="itbms-price w-full border px-4 py-2 rounded"
				/>
			</div>
			<div v-if="updatePage">
				<label
				class=" block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
				>Price</label
				>
				<input
				type="number"
				min="0"
				:value="props.form.price"
				@input="
					updateField('price', $event.target.value)
				"
				class="itbms-price w-full border px-4 py-2 rounded"
				/>
			</div>

			<!-- Quantity -->
			<div>
				<label
					class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
				>
					Quantity
				</label>
				<input
					type="number"
					min="0"
					step="1"
					:value="props.form.quantity"
					@input="
						updateField('quantity', Math.max(1, Number($event.target.value)))
					"
					class="itbms-quantity w-full border px-4 py-2 rounded"
				/>
			</div>

			<!-- Description (full width) -->
			<div class="col-span-2">
				<label
					class="block mb-1 font-medium text-gray-700 after:content-['*'] after:text-red-500 ml-1"
				>
					Description
				</label>
				<textarea
					:value="props.form.description"
					@input="updateField('description', $event.target.value)"
					@blur="trimField('description', $event.target.value)"
					class="itbms-description w-full border px-4 py-2 rounded resize-none"
				></textarea>
			</div>

			<!-- RAM -->
			<div>
				<label class="block mb-1 font-medium text-gray-700">RAM (GB)</label>
				<input
					type="number"
					:value="props.form.ramGb"
					@input="updateField('ramGb', Number($event.target.value))"
					class="itbms-ramGb w-full border px-4 py-2 rounded"
				/>
			</div>

			<!-- Screen Size -->
			<div>
				<label class="block mb-1 font-medium text-gray-700"
					>Screen Size (Inch)</label
				>
				<input
					type="number"
					step="0.1"
					:value="props.form.screenSizeInch"
					@input="updateField('screenSizeInch', Number($event.target.value))"
					class="itbms-screenSizeInch w-full border px-4 py-2 rounded"
				/>
			</div>

			<!-- Storage -->
			<div>
				<label class="block mb-1 font-medium text-gray-700">Storage (GB)</label>
				<input
					type="number"
					:value="props.form.storageGb"
					@input="updateField('storageGb', Number($event.target.value))"
					class="itbms-storageGb w-full border px-4 py-2 rounded"
				/>
			</div>

			<!-- Color -->
			<div>
				<label class="block mb-1 font-medium text-gray-700">Color</label>
				<input
					type="text"
					:value="props.form.color"
					@input="updateField('color', $event.target.value)"
					@blur="trimField('color', $event.target.value)"
					class="itbms-color w-full border px-4 py-2 rounded"
				/>
			</div>
		</div>

		<!-- Buttons -->
		<div class="col-span-12 flex justify-center gap-6 mt-10">
			<button
				v-if="!updatePage"
				type="submit"
				:disabled="!isFormValid || !isDirty || isSubmitting"
				class="itbms-save-button bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
			>
				{{ isSubmitting ? "Saving..." : "Save" }}
			</button>

			<button
				v-if="updatePage"
				type="submit"
				:disabled="!isupdate || !isFormValid"
				class="itbms-save-button bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
			>
				Save
			</button>

			<button
				type="button"
				@click="$emit('cancel')"
				class="itbms-cancel-button border border-gray-400 px-6 py-2 rounded hover:bg-gray-100"
			>
				Cancel
			</button>
		</div>
	</form>
</template>