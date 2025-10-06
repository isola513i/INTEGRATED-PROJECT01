<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
	totalItems: { type: Number, default: 0 },
	totalPrice: { type: Number, default: 0 }, // หน่วย: บาท
	address: { type: String, default: "" },
	note: { type: String, default: "" },
	loading: { type: Boolean, default: false },
});

const emit = defineEmits(["place-order", "update:address", "update:note"]);

const address = ref(props.address);
const note = ref(props.note);

watch(
	() => props.address,
	(v) => (address.value = v)
);
watch(
	() => props.note,
	(v) => (note.value = v)
);

watch(address, (v) => emit("update:address", v));
watch(note, (v) => emit("update:note", v));

const noteLimit = 200;
const noteCount = computed(() => note.value.length);
const addressRequired = computed(() => address.value.trim().length > 0);

const formattedPrice = computed(
	() =>
		`Baht ${Number(props.totalPrice || 0).toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		})}`
);

function onPlaceOrder() {
	if (!addressRequired.value || props.totalItems <= 0 || props.loading) return;
	emit("place-order", {
		address: address.value.trim(),
		note: note.value.trim(),
	});
}
</script>

<template>
	<aside
		class="bg-white rounded-xl shadow border p-5 w-full max-w-md space-y-4"
		aria-label="Cart Summary"
	>
		<header class="flex items-center justify-between">
			<h2 class="text-black text-lg font-semibold">Cart Summary</h2>
		</header>

		<section class="divide-y divide-gray-200">
			<!-- Ship To -->
			<div class="pb-4">
				<h3 class="text-lg font-semibold text-gray-800 mb-3">Ship To</h3>

				<!-- Address -->
				<div class="space-y-1.5">
					<div class="flex items-center gap-2">
						<span class="text-sm font-medium text-gray-900">Address</span>
						<span class="text-xs text-gray-500">
							(Address No., Street, Subdistrict, District, Province, Postal
							Code)
						</span>
					</div>

					<p v-if="!addressRequired" class="text-xs text-red-600">
						กรุณากรอกที่อยู่สำหรับจัดส่ง
					</p>

					<textarea
						v-model="address"
						rows="3"
						placeholder="Address No, Street, Subdistrict, District, Province, Postal Code"
						class="text-gray-900 w-full rounded-lg border border-gray-300 focus:border-black focus:ring-0 text-sm p-3 shadow-inner placeholder:text-gray-400 transition itbms-shipping-address"
					></textarea>
				</div>

				<!-- Note -->
				<div class="mt-3 space-y-1.5">
					<label class="block text-sm font-medium text-gray-800">Note</label>
					<textarea
						v-model="note"
						:maxlength="noteLimit"
						rows="2"
						placeholder="Additional instructions or requests"
						class="text-gray-900 w-full rounded-lg border border-gray-300 focus:border-black focus:ring-0 text-sm p-3 shadow-inner placeholder:text-gray-400 transition itbms-order-note"
					></textarea>
					<div class="text-xs text-gray-500 text-right">
						{{ noteCount }}/{{ noteLimit }}
					</div>
				</div>
			</div>

			<!-- Summary -->
			<div class="pt-4">
				<div class="space-y-2 text-sm">
					<div class="flex items-center justify-between">
						<span class="text-gray-600">Total items :</span>
						<span class="font-medium text-gray-900 itbms-total-order-items">{{
							totalItems
						}}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-600">Total price :</span>
						<span class="font-semibold itbms-total-order-price text-gray-900">
							{{ formattedPrice }}
						</span>
					</div>
				</div>

				<button
					class="itbms-place-order-button mt-4 w-full rounded-lg border border-black bg-white text-black py-2.5 font-medium transition hover:bg-black hover:text-white focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
					:disabled="!addressRequired || totalItems <= 0 || loading"
					@click="onPlaceOrder"
				>
					{{ loading ? "Placing..." : "Place Order" }}
				</button>
			</div>
		</section>
	</aside>
</template>
