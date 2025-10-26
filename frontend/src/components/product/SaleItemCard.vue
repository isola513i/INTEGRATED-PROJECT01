<script setup>
import { computed } from "vue";
import defaultImage from "@/assets/images/brands/default.png";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "vue-router";
import { useCartStore } from "@/store/useCartStore";
import { useFlashStore } from "@/store/useFlashStore";

const cart = useCartStore();
const flash = useFlashStore();
const props = defineProps({
	item: { type: Object, required: true },
});

const auth = useAuthStore();
const route = useRouter();
const coverSrc = computed(() => {
	return props.item?.thumbnailUrl || props.item?.imageUrl || defaultImage;
});

const onAdd = () => {
	if (!auth.isLoggedIn) {
		route.push("/signin"); // ใช้ route ที่ import มา
		return;
	}

	const availableQuantity = Number(props.item?.quantity ?? 0);
	if (availableQuantity <= 0) {
		flash.setMessage(
			"❌ This item is out of stock.",
			"fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-lg bg-red-500 text-white text-sm shadow-lg itbms-message" // เพิ่ม itbms-message ถ้าต้องการ
		);
		return;
	}

	cart.add(props.item);
	flash.setMessage(
		"✅ Added to cart", // อาจจะเปลี่ยน Icon เป็น ✅
		"fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-lg bg-green-500 text-white text-sm shadow-lg itbms-message" // เพิ่ม itbms-message ถ้าต้องการ
	);
};
</script>

<template>
	<div
		class="itbms-row bg-white rounded-lg hover:shadow-md transition duration-200 w-[180px] sm:w-[200px]"
	>
		<!-- รูป + ข้อความ (กดแล้วไปหน้า detail) -->
		<router-link :to="`/sale-items/${item.id}`" class="block no-underline">
			<div class="w-full h-[180px] grid place-items-center">
				<img
					:src="coverSrc"
					:alt="item.model || item.brandName || 'product'"
					class="max-h-full max-w-full object-contain"
					loading="lazy"
				/>
			</div>

			<div class="px-3 text-left">
				<h2 class="itbms-brand text-sm font-semibold text-gray-900 mb-0.5">
					{{ item.brandName || "-" }}
				</h2>
				<p class="itbms-model text-xs text-gray-700 leading-snug">
					{{ item.model || "-" }}
				</p>
				<p class="text-xs text-gray-500 leading-snug">
					<span class="itbms-ramGb">{{ item.ramGb ?? "-" }}</span>
					/
					<span class="itbms-storageGb">{{ item.storageGb ?? "-" }}</span
					>GB
				</p>
				<p class="itbms-color text-xs text-gray-500 leading-snug">
					{{ item.color || "-" }}
				</p>
			</div>
		</router-link>

		<div class="px-3 pb-3 mt-1 flex items-center justify-between">
			<p class="itbms-price text-sm font-semibold text-gray-900">
				<span class="itbms-price-unit">Baht</span>
				{{
					Number(item?.price ?? 0).toLocaleString("en-US", {
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					})
				}}
			</p>
			<button
				type="button"
				class="itbms-add-to-cart-button px-3 py-1 text-[11px] font-semibold rounded-full bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98] transition"
				@click="onAdd"
			>
				Add to cart
			</button>
		</div>
	</div>
</template>
