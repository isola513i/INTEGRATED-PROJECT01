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
const sortField = ref('id')
const sortDirection = ref('asc')
const paginate = ref({})

const syncSessionToRefs = () => {
  pageSize.value = parseInt(sessionStorage.getItem("pageSize")) || 10;
  sortField.value = sessionStorage.getItem("sortField") || "id";
  sortDirection.value = sessionStorage.getItem("sortDirection") || "asc";
  filteredBrands.value = JSON.parse(
  sessionStorage.getItem("filterBrands") || "[]"
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
    sessionStorage.getItem("sortDirection")
  );
  

  saleItems.value = paginate.value.content;
};


onMounted(() => {
  syncSessionToRefs();
  loadItems(parseInt(sessionStorage.getItem('page')) || 0);
});

const handleSortChange = (value) => {
	console.log(value)
	if(value == 'none'){
		sortDirection.value = 'asc'
		sortField.value = 'id'
	}else{
		sortDirection.value = value;
		sortField.value = 'brand.name'

	}
  loadItems(paginate.value.page);
};
const handlePageSizeChange = (size) => {
  pageSize.value = size;
  loadItems(paginate.value.page);
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
        <BrandFilters   @update:pageSize="handlePageSizeChange" @update:brands="handleBrandFilterChange" />
      </div>
      <!-- Right side - Sort buttons -->
      <div class="flex-shrink-0">
        <SortButtons  :selected="sortType" @update:sort="handleSortChange" />
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
  :current-page="paginate.page"
  :total-pages="paginate.totalPages"
  @update:page="(page) => {
    loadItems(page);
  }"
/>
    </div>
  </div>
</template>