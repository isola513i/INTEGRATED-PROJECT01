<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/store/useCartStore";

const cart = useCartStore();

// modal state
const showModal = ref(false);
const pendingDeleteId = ref(null);

function confirmDelete(id) {
	pendingDeleteId.value = id;
	showModal.value = true;
}

function deleteItem() {
	if (pendingDeleteId.value !== null) {
		cart.setQty(pendingDeleteId.value, 0);
	}
	pendingDeleteId.value = null;
	showModal.value = false;
}

// ---- helpers ----
const fmt = (n) =>
	Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 0 });

// group ตามผู้ขาย
const groups = computed(() => {
	const map = new Map();
	for (const it of cart.items) {
		const name = it?.sellerUsername || "Unknown";
		const id = it?.sellerId ?? name; // ถ้าไม่มี id ก็ใช้ name เป็น key
		const key = `${id}::${name}`;
		if (!map.has(key)) map.set(key, { id, name, items: [] });
		map.get(key).items.push(it);
	}
	return Array.from(map.values());
});

// select-all
const isAllSelected = computed(
	() => cart.items.length > 0 && cart.items.every((i) => i.selected)
);

function toggleAll() {
	const next = !isAllSelected.value;
	cart.items.forEach((i) => (i.selected = next));
	cart.save();
}

function toggleSeller(name) {
	const group = groups.value.find((g) => g.name === name);
	if (!group) return;
	const next = !(
		group.items.length > 0 && group.items.every((i) => i.selected)
	);
	group.items.forEach((i) => (i.selected = next));
	cart.save();
}

function toggleItem(id) {
	cart.toggleSelect(id);
}

// ลดจำนวน: ถ้าเหลือ 1 แล้วกดลด -> เปิดยืนยันลบ
function decQtyByItem(it) {
	const q = Number(it.quantity || 1);
	if (q <= 1) {
		confirmDelete(it.id);
	} else {
		cart.dec(it.id, 1);
	}
}

function incQty(id) {
	cart.inc(id, 1);
}
function onQtyInput(id, e) {
	const v = Number(e.target.value);
	if (Number.isFinite(v) && v <= 0) {
		confirmDelete(id);
	} else {
		cart.setQty(id, v);
	}
}
</script>

<template>
	<section class="max-w-3xl mx-auto">
		<!-- Header -->
		<div class="bg-white rounded-lg border border-gray-200 shadow-sm">
			<!-- Select All -->
			<div class="px-4 py-3 flex items-center gap-2">
				<input
					id="select-all"
					class="itbms-select-all h-4 w-4 accent-blue-600"
					type="checkbox"
					:checked="isAllSelected"
					@change="toggleAll"
				/>
				<label for="select-all" class="text-sm text-gray-800 font-medium">
					Select All
				</label>
			</div>

			<!-- Groups by seller -->
			<div class="px-4 pb-4 space-y-4">
				<div
					v-for="group in groups"
					:key="group.id"
					class="bg-gray-50 rounded border border-gray-200"
				>
					<!-- Seller header -->
					<div
						class="flex items-center gap-2 px-3 py-2 border-b border-gray-200"
					>
						<input
							class="itbms-select-nickname h-4 w-4 accent-blue-600"
							type="checkbox"
							:checked="
								group.items.length > 0 && group.items.every((i) => i.selected)
							"
							@change="toggleSeller(group.name)"
						/>
						<div class="itbms-nickname text-sm font-semibold text-gray-900">
							{{ group.name }}
						</div>
					</div>

					<!-- Items -->
					<div class="divide-y divide-gray-200">
						<div
							v-for="it in group.items"
							:key="it.id"
							class="itbms-item-row flex items-center gap-3 px-3 py-3 bg-white"
						>
							<!-- select item -->
							<input
								class="h-4 w-4 accent-blue-600"
								type="checkbox"
								:checked="it.selected"
								@change="toggleItem(it.id)"
							/>

							<!-- image -->
							<div
								class="w-16 h-16 shrink-0 bg-gray-100 rounded overflow-hidden grid place-items-center"
							>
								<img
									:src="it.thumbnailUrl || it.imageUrl"
									:alt="it.model || it.brandName || 'item'"
									class="max-w-full max-h-full object-contain"
									loading="lazy"
								/>
							</div>

							<!-- desc -->
							<div class="itbms-item-description flex-1">
								<div class="text-sm font-semibold text-gray-900">
									{{ it.brandName }} {{ it.model }}
									<span v-if="it.storageGb" class="text-gray-500 font-normal">
										({{ it.storageGb }}GB<span v-if="it.color"
											>, {{ it.color }}</span
										>)
									</span>
								</div>
								<div class="text-xs text-gray-500 line-clamp-1">
									{{ it.description || "" }}
								</div>
							</div>

							<!-- quantity control -->
							<div class="itbms-item-quantity flex items-center gap-2">
								<button
									class="itbms-dec-qty-button inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
									@click="decQtyByItem(it)"
									aria-label="decrease"
									:title="(it.quantity || 1) <= 1 ? 'Remove item' : 'decrease'"
								>
									-
								</button>

								<input
									class="text-black w-12 h-8 text-center rounded border border-gray-300"
									type="number"
									min="1"
									:max="it.maxQty || 999999"
									:value="it.quantity"
									@input="onQtyInput(it.id, $event)"
								/>

								<button
									class="itbms-inc-qty-button inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
									@click="incQty(it.id)"
									aria-label="increase"
									:disabled="(it.quantity || 0) >= (it.maxQty || Infinity)"
									:title="
										(it.quantity || 0) >= (it.maxQty || Infinity)
											? 'Reached max available'
											: 'increase'
									"
								>
									+
								</button>
							</div>

							<!-- price -->
							<div class="itbms-item-total-price w-28 text-right">
								<div class="text-sm text-gray-500">Price:</div>
								<div class="text-base font-semibold text-gray-900">
									{{ fmt((it.price || 0) * (it.quantity || 0)) }}
								</div>
							</div>

							<!-- delete button -->
							<div class="itbms-item-delete w-16 text-right">
								<button
									class="px-2 py-1 text-sm text-red-600 hover:text-red-800"
									@click="confirmDelete(it.id)"
								>
									Remove
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Empty state -->
				<div
					v-if="cart.items.length === 0"
					class="text-center text-gray-500 py-10"
				>
					Your cart is empty.
				</div>
			</div>
		</div>
	</section>
	<div
		v-if="showModal"
		class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
	>
		<div
			class="itbms-message bg-white rounded-xl p-8 shadow-lg max-w-sm w-full text-center"
		>
			<div
				class="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"
			>
				<svg
					class="w-6 h-6 text-red-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					></path>
				</svg>
			</div>

			<h2 class="text-lg font-medium mb-2 text-gray-800">Confirm Deletion</h2>

			<p class="mb-8 text-sm text-gray-500">
				Are you sure you want to remove this item from your cart? This action
				cannot be undone.
			</p>

			<div class="flex justify-center space-x-3">
				<button
					@click="deleteItem"
					class="itbms-confirm-button px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out cursor-pointer"
				>
					Confirm Delete
				</button>
				<button
					@click="showModal = false"
					class="itbms-cancel-button px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150 ease-in-out cursor-pointer"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>
