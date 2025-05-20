<script setup>
import { fetchSaleItems } from "@/services/saleItemService";
import { deleteBrandById } from "@/services/brandService";
import { useFlashStore } from "@/store/useFlashStore";
import { ref } from "vue";

const fields = ["Id", "Name", "Action"];
const flash = useFlashStore();
const showModal = ref(false);
const brandId = ref(0);
const brandName = ref("");
const messageDelete = ref("");
const canDelete = ref(true);
const props = defineProps({
	items: {
		type: Array,
		required: true,
	},
});

const handleModal = async (id, name) => {
	showModal.value = !showModal.value;
	brandId.value = id;
	brandName.value = name;
	const product = await fetchSaleItems();
	const usedIn = product.filter((item) => item.brandName === name);
	if (usedIn.length > 0) {
		canDelete.value = false;
		messageDelete.value = `Delete ${name} is not allowed. There are sale items with ${name} brand.`;
	} else {
		canDelete.value = true;
		messageDelete.value = `Do you want to delete ${name} brand?`;
	}
};

async function deleteItem(id) {
	try {
		await deleteBrandById(id);
		const index = props.items.findIndex((item) => item.brandId === id);
		props.items.splice(index, 1);
		flash.setMessage(
			"The brand has been deleted.",

			"m-4 p-4 bg-green-100 text-green-800 shadow itbms-message"
		);
		handleModal();
	} catch (error) {
		flash.setMessage(
			"An error has occurred, the brand does not exist.",
			"m-4 p-4 bg-red-100 text-red-800 shadow itbms-message"
		);
	}
}
</script>

<template>
	<div class="flex justify-center m-5">
		<div class="w-[75em]">
			<div
				class="w-full bg-[#171717] grid grid-cols-3 text-white text-sm font-semibold"
			>
				<div
					v-for="(field, index) in fields"
					:key="index"
					class="text-center border-1 border-gray-200 py-2"
				>
					{{ field }}
				</div>
			</div>
			<div class="w-full grid grid-rows">
				<div
					v-for="(item, key, index) in items"
					class="itbms-row grid grid-cols-3"
				>
					<div
						class="itbms-id text-center border-1 border-gray-500 py-2"
						:key="index"
						:class="key % 2 === 0 ? `bg-gray-200` : 'bg-white'"
					>
						{{ item.brandId }}
					</div>
					<div
						class="itbms-name text-center border-1 border-gray-500 py-2"
						:key="index"
						:class="key % 2 === 0 ? `bg-gray-200` : 'bg-white'"
					>
						{{ item.name }}
					</div>
					<div
						class="flex justify-center gap-3 items-center border-1 border-gray-500"
						:key="index"
						:class="key % 2 === 0 ? 'bg-gray-200' : 'bg-white'"
					>
						<router-link
							:to="`/brands/${item.brandId}/edit`"
							class="no-underline"
						>
							<p
								class="itbms-edit-button p-1 px-3 border-1 rounded-md border-blue-400 text-sm text-blue-400"
							>
								E
							</p>
						</router-link>
						<button
							class="itbms-delete-button p-1 px-3 border-1 rounded-md border-blue-400 text-sm text-blue-400"
							@click="handleModal(item.brandId, item.name)"
						>
							D
						</button>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="showModal"
			class="fixed inset-0 bg-[#ffffff8f] bg-opacity-50 flex items-center justify-center z-50"
		>
			<div
				class="itbms-message bg-white rounded-lg p-6 shadow-lg max-w-sm w-full"
			>
				<h2 class="text-xl font-semibold mb-4 text-gray-800">
					Delete Confirmation
				</h2>
				<p class="mb-6 text-gray-800">
					{{ messageDelete }}
				</p>
				<div class="flex justify-end space-x-4">
					<button
						@click="handleModal"
						class="itbms-cancel-button bg-[#cc3535] px-4 py-2 rounded hover:bg-[#6d3e3e]"
					>
						Cancel
					</button>
					<button
						@click="deleteItem(brandId)"
						v-if="canDelete"
						class="itbms-confirm-button bg-[#5eb238] text-white px-4 py-2 rounded hover:bg-[#58914c]"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
