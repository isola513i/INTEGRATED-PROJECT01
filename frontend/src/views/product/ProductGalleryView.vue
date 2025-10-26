<script setup>
import { ref, onMounted, watch } from "vue";
import { fetchSaleItemsV2 } from "@/services/saleItemService";
import SaleItemCard from "@/components/product/SaleItemCard.vue";
import PromoBar from "@/components/promo/PromoBar.vue";
import { useFlashStore } from "@/store/useFlashStore";
import SortButtons from "@/components/sort/SortButtons.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import FilterBar from "@/components/filter/FilterBar.vue";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuthStore } from "@/store/useAuthStore";

const saleItems = ref([]);
const flash = useFlashStore();
const pageSize = ref(10);
const filteredBrands = ref([]);
const min = ref(sessionStorage.getItem("minPrice") || null);
const max = ref(sessionStorage.getItem("maxPrice") || null);
const storages = ref([]);
const sortField = ref("id");
const sortDirection = ref("asc");
const sortType = ref("");
const paginate = ref({});
const searchStore = useSearchStore();
const auth = useAuthStore();

// sync ค่า sessionStorage
const syncSessionToRefs = () => {
	pageSize.value = parseInt(sessionStorage.getItem("pageSize")) || 10;
	sortField.value = sessionStorage.getItem("sortField") || "id";
	sortDirection.value = sessionStorage.getItem("sortDirection") || "asc";
	filteredBrands.value = JSON.parse(
		sessionStorage.getItem("filterBrands") || "[]"
	);
	storages.value = JSON.parse(sessionStorage.getItem("filterStorage") || "[]");
};

const loadItems = async (page) => {
	sessionStorage.setItem("page", page);
	sessionStorage.setItem("pageSize", pageSize.value);
	sessionStorage.setItem("sortField", sortField.value);
	sessionStorage.setItem("sortDirection", sortDirection.value);
	sessionStorage.setItem("filterBrands", JSON.stringify(filteredBrands.value));
	sessionStorage.setItem("minPrice", min.value);
	sessionStorage.setItem("maxPrice", max.value);

	paginate.value = await fetchSaleItemsV2(
		filteredBrands.value,
		page,
		pageSize.value,
		sortField.value,
		sortDirection.value,
		storages.value,
		min.value ? parseInt(min.value) : null,
		max.value ? parseInt(max.value) : null,
		searchStore.search
	);

	saleItems.value = paginate.value.content;
};

onMounted(() => {
	syncSessionToRefs();
	loadItems(parseInt(sessionStorage.getItem("page")) || 0);
});

// --- filter อื่น ๆ ---
async function handleGoToLast() {
	await loadItems(0);
	const totalPages = paginate.value.totalPages;
	const lastPageIndex = totalPages - 1;
	await loadItems(lastPageIndex);
}
const handleSortChange = (value) => {
	if (value == "none") {
		sortDirection.value = "asc";
		sortField.value = "id";
	} else {
		sortDirection.value = value;
		sortField.value = "brand.name";
	}
	loadItems(paginate.value.page);
};
const handlePageSizeChange = (size) => {
	pageSize.value = size;
	loadItems(0);
};
const handleBrandFilterChange = (brands) => {
	filteredBrands.value = brands;
	loadItems(0);
};
const handleStorageFilterChange = (storage) => {
	storages.value = storage;
	sessionStorage.setItem("filterStorage", JSON.stringify(storages.value));
	loadItems(0);
};
const handlePriceFilterChange = (price) => {
	if (!price) {
		min.value = null;
		max.value = null;
	} else {
		min.value = price.min;
		max.value = price.max;
	}
	loadItems(0);
};
watch(
	() => searchStore.search,
	() => {
		loadItems(0);
	}
);
</script>

<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Container -->
		<div class="max-w-7xl mx-auto px-4 pt-8 pb-16 flex flex-col gap-6">
			<!-- Breadcrumb -->
			<nav aria-label="Breadcrumb" class="text-sm text-gray-500">
				<ol class="flex items-center flex-wrap gap-1">
					<li class="flex items-center">
						<router-link
							to="/"
							class="text-gray-500 hover:text-gray-900 font-medium transition-colors"
						>
							Home
						</router-link>
					</li>

					<li class="text-gray-400 px-1 select-none">/</li>

					<li class="flex items-center">
						<router-link
							to="/sale-items"
							class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
						>
							Sale Items
						</router-link>
					</li>
				</ol>
			</nav>

			<!-- Top Controls: Filters + Sort -->
			<section
				class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
			>
				<!-- Filters block -->
				<div class="flex-1">
					<FilterBar
						@update:brands="handleBrandFilterChange"
						@update:price="handlePriceFilterChange"
						@update:storage="handleStorageFilterChange"
						@update:pageSize="handlePageSizeChange"
					/>
				</div>

				<!-- Sort block -->
				<div
					class="flex-shrink-0 md:w-48 lg:w-56 bg-white border border-gray-200 rounded-xl shadow-sm p-3"
				>
					<div
						class="text-[11px] uppercase tracking-wide text-gray-500 font-medium mb-2 text-center md:text-left"
					>
						Sort by
					</div>
					<SortButtons :selected="sortType" @update:sort="handleSortChange" />
				</div>
			</section>

			<!-- Items grid section -->
			<section
				class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6"
			>
				<!-- (optional) header row for result info -->
				<div class="flex items-center justify-between mb-4">
					<div class="text-sm text-gray-600">
						<span class="font-medium text-gray-900">{{
							saleItems.length
						}}</span>
						<span class="ml-1">items shown</span>
					</div>

					<div
						v-if="flash.message"
						:class="flash.style"
						class="text-xs text-center"
					>
						{{ flash.message }}
					</div>
				</div>

				<!-- product grid -->
				<div
					v-if="saleItems.length > 0"
					class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
				>
					<SaleItemCard
						v-for="item in saleItems"
						:key="item.saleItemId"
						:item="item"
					/>
				</div>

				<!-- empty state -->
				<div
					v-else
					class="text-center text-gray-500 text-base py-16 border border-dashed border-gray-300 rounded-xl bg-gray-50/50"
				>
					No sale items found.
					<div class="text-gray-400 text-sm mt-1">
						Try adjusting filters or clearing all filters.
					</div>
				</div>
			</section>

			<!-- Pagination -->
			<section class="flex justify-center">
				<Pagination
					:current-page="paginate.page"
					:total-pages="paginate.totalPages"
					@update:page="(page) => loadItems(page)"
					@go-to-last="handleGoToLast"
				/>
			</section>
		</div>
	</div>
</template>
