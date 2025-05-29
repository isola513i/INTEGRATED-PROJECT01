<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { fetchSaleItems } from "@/services/saleItemService";
import SaleItemCard from "@/components/product/SaleItemCard.vue";
import ProductCarousel from "@/components/product/ProductCarousel.vue";
import PromoBar from "@/components/promo/PromoBar.vue";
import { useFlashStore } from "@/store/useFlashStore";

const saleItems = ref([]);
const loading = ref(true);
const router = useRouter();
const route = useRoute();
const successMessage = ref("");
const flash = useFlashStore();

onMounted(async () => {
	if (route.query.successMessage) {
		successMessage.value = String(route.query.successMessage);
		setTimeout(() => {
			successMessage.value = "";
		}, 4000);
		router.replace({ query: {} });
	}

	try {
		const data = await fetchSaleItems();
		saleItems.value = Array.isArray(data) ? data : [];
	} catch (err) {
		router.push("/server-error");
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<div class="min-h-screen bg-white">
		<PromoBar />
		<ProductCarousel />
		<div class="flex justify-between pt-10 py-2 mx-4">
			<div class="itbms-sale-item-add">
				<router-link
					to="/sale-items/add"
					class="px-6 py-2 bg-[#171717] text-white rounded-2xl hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 text-sm font-semibold"
				>
					Add New Sale Item
				</router-link>
			</div>
			<div class="itbms-manage-brand">
				<router-link
					to="/brands"
					class="px-6 py-2 bg-[#171717] text-white rounded-2xl hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 text-sm font-semibold"
				>
					Manage Brand
				</router-link>
			</div>
		</div>

		<div v-if="flash.message" :class="flash.style">
			{{ flash.message }}
		</div>

		<div class="px-4 py-2">
			<div
				v-if="saleItems.length > 0"
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
			>
				<SaleItemCard
					v-for="item in saleItems"
					:key="item.saleItemId"
					:item="item"
				/>
			</div>
			<div v-else class="p-10 text-center text-gray-400 text-xl">
				No sale item
			</div>
		</div>
	</div>
</template>
