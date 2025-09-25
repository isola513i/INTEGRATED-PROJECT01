<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchSaleItems, fetchSaleItemsV2 } from "@/services/saleItemService";
import SaleItemList from "@/components/product/SaleItemList.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { useFlashStore } from "@/store/useFlashStore";
import { useAuthStore } from "@/store/useAuthStore";

const router = useRouter();
const flash = useFlashStore();

const saleItems = ref([]);
const loading = ref(true);

// --- เหลือเท่าที่ API ใช้จริง ---
const pageSize = ref(10);
const sortField = ref("id");
const sortDirection = ref("asc");
const paginate = ref({ page: 0, totalPages: 0 });
const userStore = useAuthStore();
const loadItems = async (page = 0) => {
  loading.value = true;
  try {
    const res = await fetchSaleItems({
      sellerId: userStore.user.id,
      page,
      size: pageSize.value,
      sortField: sortField.value,
      sortDirection: sortDirection.value,
    });
    paginate.value = res;
    saleItems.value = res?.content ?? [];
  } catch (e) {
    console.error(e);
    router.push("/server-error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadItems(0);
});

// เปลี่ยน page size → กลับหน้าแรก
const handlePageSizeChange = (size) => {
  pageSize.value = size;
  loadItems(0);
};

async function handleGoToLast() {
  if (!paginate.value?.totalPages) await loadItems(0);
  const lastPageIndex = (paginate.value.totalPages || 1) - 1;
  await loadItems(lastPageIndex);
}
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

    <div v-if="flash.message" :class="flash.style">{{ flash.message }}</div>

    <div
      v-if="!loading && saleItems.length === 0"
      class="p-10 text-center text-gray-400 text-xl"
    >
      No sale item
    </div>

    <SaleItemList v-if="saleItems.length > 0" :items="saleItems" />

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
