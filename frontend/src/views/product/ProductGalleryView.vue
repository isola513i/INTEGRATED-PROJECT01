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
  <div class="min-h-screen bg-white">
    <PromoBar />

    <!-- Responsive Controls Section -->
    <div
      class="flex flex-col md:flex-row gap-4 items-center w-full max-w-7xl mx-auto px-4"
    >
      <!-- Filter -->
      <div class="flex-grow">
        <FilterBar
          @update:brands="handleBrandFilterChange"
          @update:price="handlePriceFilterChange"
          @update:storage="handleStorageFilterChange"
          @update:pageSize="handlePageSizeChange"
        />
      </div>

      <!-- Sort -->
      <div class="flex-shrink-0">
        <SortButtons :selected="sortType" @update:sort="handleSortChange" />
      </div>
    </div>
    <!-- Add Button -->
    <div class="w-full max-w-7xl mx-auto px-4 mt-4 flex justify-end">
      <router-link
        to="/sale-items/add"
        class="px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-black hover:scale-105 transition-all duration-300 text-sm font-semibold shadow-md"
      >
        + Add New Sale Item
      </router-link>
    </div>

    <!-- Flash message -->
    <div v-if="flash.message" :class="flash.style" class="px-4">
      {{ flash.message }}
    </div>

    <!-- Product Cards -->
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
    <!-- Pagination -->
    <div class="flex justify-center py-4">
      <Pagination
        :current-page="paginate.page"
        :total-pages="paginate.totalPages"
        @update:page="(page) => loadItems(page)"
        @go-to-last="handleGoToLast"
      />
    </div>
  </div>
</template>
