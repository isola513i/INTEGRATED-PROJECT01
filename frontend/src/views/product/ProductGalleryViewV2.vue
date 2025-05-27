<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { fetchSaleItemsV2 } from "@/services/saleItemService";
import SaleItemCard from "@/components/product/SaleItemCard.vue";
import ProductCarousel from "@/components/product/ProductCarousel.vue";
import PromoBar from "@/components/promo/PromoBar.vue";
import { useFlashStore } from "@/store/useFlashStore";
import SortButtons from "@/components/sort/SortButtons.vue";
import BrandFilters from "@/components/filter/FilterBrands.vue";
import Pagination from "@/components/Pagination/Pagination.vue";

const saleItems = ref([]);
const flash = useFlashStore();
const pageSize = ref(10);
const filteredBrands = ref([]);
const sortField = ref("id");
const sortDirection = ref("asc");
const sortType = ref("");
const paginate = ref({});

const syncSessionToRefs = () => {
  pageSize.value = parseInt(sessionStorage.getItem("pageSize")) || 10;
  sortField.value = sessionStorage.getItem("sortField") || "id";
  sortDirection.value = sessionStorage.getItem("sortDirection") || "asc";
  filteredBrands.value = JSON.parse(
    sessionStorage.getItem("filterBrands") || "[]",
  );
};

const loadItems = async (page) => {
  sessionStorage.setItem("page", page);
  sessionStorage.setItem("pageSize", pageSize.value);
  sessionStorage.setItem("sortField", sortField.value);
  sessionStorage.setItem("sortDirection", sortDirection.value);
  sessionStorage.setItem("filterBrands", JSON.stringify(filteredBrands.value));

  paginate.value = await fetchSaleItemsV2(
    JSON.parse(sessionStorage.getItem("filterBrands")),
    parseInt(sessionStorage.getItem("page")),
    parseInt(sessionStorage.getItem("pageSize")),
    sessionStorage.getItem("sortField"),
    sessionStorage.getItem("sortDirection"),
  );

  saleItems.value = paginate.value.content;
};

onMounted(() => {
  syncSessionToRefs();
  loadItems(parseInt(sessionStorage.getItem("page")) || 0);
});

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
</script>

<template>
  <div class="min-h-screen bg-white">
    <PromoBar />
    <ProductCarousel />

    <!-- Responsive Controls Section -->
    <div
      class="flex flex-col md:flex-row flex-wrap gap-4 justify-between items-start md:items-center pt-10 py-2 px-4"
    >
      <!-- Buttons: Add & Manage -->
      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div class="itbms-sale-item-add">
          <router-link
            to="/sale-items/add"
            class="block text-center px-6 py-2 bg-[#171717] text-white rounded hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 text-sm font-semibold"
          >
            Add New Sale Item
          </router-link>
        </div>
        <div class="itbms-manage-brand">
          <router-link
            to="/brands"
            class="block text-center px-6 py-2 bg-[#171717] text-white rounded hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 text-sm font-semibold"
          >
            Manage Brand
          </router-link>
        </div>
      </div>

      <!-- Filter -->
      <div class="w-full md:w-auto">
        <BrandFilters
          @update:pageSize="handlePageSizeChange"
          @update:brands="handleBrandFilterChange"
        />
      </div>

      <!-- Sort -->
      <div class="w-full sm:w-auto flex justify-end md:justify-start">
        <SortButtons :selected="sortType" @update:sort="handleSortChange" />
      </div>
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
      />
    </div>
  </div>
</template>
