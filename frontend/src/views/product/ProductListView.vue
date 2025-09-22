<script setup>
import { useRouter, useRoute } from "vue-router";
import { fetchSaleItems } from "@/services/saleItemService";
import SaleItemList from "@/components/product/SaleItemList.vue";
import ProductCarousel from "@/components/product/ProductCarousel.vue";
import PromoBar from "@/components/promo/PromoBar.vue";
import { useFlashStore } from "@/store/useFlashStore";
import { ref, onMounted, watch } from "vue";
import { fetchSaleItemsV2 } from "@/services/saleItemService";
import SaleItemCard from "@/components/product/SaleItemCard.vue";
import SortButtons from "@/components/sort/SortButtons.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import FilterBar from "@/components/filter/FilterBar.vue";
import { useSearchStore } from "@/store/useSearchStore";

const saleItems = ref([]);
const loading = ref(true);
const router = useRouter();
const route = useRoute();
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

const syncSessionToRefs = () => {
  pageSize.value = parseInt(sessionStorage.getItem("pageSize")) || 10;
  sortField.value = sessionStorage.getItem("sortField") || "id";
  sortDirection.value = sessionStorage.getItem("sortDirection") || "asc";
  filteredBrands.value = JSON.parse(
    sessionStorage.getItem("filterBrands") || "[]"
  );
  storages.value = JSON.parse(sessionStorage.getItem("filterStorage") || "[]");
  // min/max เก็บค่าไว้แล้วด้านบน ไม่ต้องแก้
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

// onMounted(async () => {
//   if (route.query.successMessage) {
//     successMessage.value = String(route.query.successMessage);
//     setTimeout(() => {
//       successMessage.value = "";
//     }, 4000);
//     router.replace({ query: {} });
//   }

//   try {
//     const data = await fetchSaleItems();
//     if (data) saleItems.value = data;
//     else saleItems.value = [];
//   } catch (err) {
//     router.push("/server-error");
//   } finally {
//     loading.value = false;
//   }
// });
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
const handlePageSizeChange = (size) => {
  pageSize.value = size;
  loadItems(0); // รีเซ็ตไปหน้าแรกและโหลดใหม่
};

watch(
  () => searchStore.search,
  () => {
    loadItems(0);
  }
);
</script>

<template>
  <div>
    <div class="flex justify-between pt-10 py-2 mx-4">
      <div class="itbms-sale-item-add">
        <router-link
          to="/sale-items/add"
          class="px-6 py-2 bg-[#171717] text-white rounded-2xl hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 text-sm font-semibold"
        >
          Add New Sale Item
        </router-link>
      </div>
      <div class="flex items-center gap-2 h-[42px]">
        <label for="pageSize" class="text-gray-700 text-sm cursor-pointer"
          >Show :</label
        >
        <select
          id="pageSize"
          v-model.number="pageSize"
          @change="handlePageSizeChange(pageSize)"
          class="border border-gray-300 px-3 h-full rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="20">20</option>
        </select>
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
    <div
      v-if="saleItems.length === 0"
      class="itbms-no-sale-item p-10 text-center text-gray-400 text-xl"
    >
      No sale item
    </div>
    <SaleItemList v-if="saleItems.length > 0" :items="saleItems" />
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

<style scoped></style>
