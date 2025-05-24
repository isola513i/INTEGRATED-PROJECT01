<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { fetchSaleItemsV2 } from "@/services/saleItemService";
import SaleItemCard from "@/components/product/SaleItemCard.vue";
import ProductCarousel from "@/components/product/ProductCarousel.vue";
import PromoBar from "@/components/promo/PromoBar.vue";
import { useFlashStore } from "@/store/useFlashStore";
import SortButtons from "@/components/sort/SortButtons.vue";
import BrandFilters from '@/components/filter/BrandFilters.vue';
import Pagination from "@/components/Pagination/Pagination.vue";

const saleItems = ref([]);
const flash = useFlashStore();
const sortType = ref("none");
const totalPages = ref(20)
const currentPage = ref(10)
const pageSize = ref(5); 

const loadItems = async () => {
	const sortField = sortType.value === "none" ? null : "brand.name";
	const sortDirection = sortType.value === "none" ? null : sortType.value;
	saleItems.value = await fetchSaleItemsV2(sortField, sortDirection, filteredBrands.value);
};

onMounted(loadItems);

const handleSortChange = (value) => {
	sortType.value = value;
	loadItems();
};
const filteredBrands = ref([]);

const handleBrandFilterChange = (brands) => {
  filteredBrands.value = brands;
  loadItems()
}
</script>

<template>
	<div class="min-h-screen bg-white">
		<PromoBar />
		<ProductCarousel />
		<div class="flex justify-between items-center pt-10 py-2 mx-4">
			<!-- Left side - Add and Manage buttons -->
			<div class="flex gap-4">
				<div class="itbms-sale-item-add">
					<router-link
						to="/sale-items/add"
						class="px-6 py-2 bg-[#171717] text-white rounded hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 text-sm font-semibold"
					>
						Add New Sale Item
					</router-link>
				</div>
				<div class="itbms-manage-brand">
					<router-link
						to="/brands"
						class="px-6 py-2 bg-[#171717] text-white rounded hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 text-sm font-semibold"
					>
						Manage Brand
					</router-link>
				</div>
			</div>

			<div>
				<BrandFilters @update:brands="handleBrandFilterChange" />
			</div>
			<!-- Right side - Sort buttons -->
			<div class="flex-shrink-0">
				<SortButtons :selected="sortType" @update:sort="handleSortChange" />
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
		<div class="flex justify-center py-4">
  			<Pagination
    		:current-page="currentPage"
    		:total-pages="totalPages"
    		@update:page="(page) => console.log(page)"
  		/>
</div>
	</div>
</template>
