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
    //router.push("/server-error");
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
  <div class="min-h-screen bg-zinc-800 text-zinc-100">
    <div class="max-w-6xl mx-auto px-4 pt-12 pb-20">
      <!-- Header + Actions -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center bg-white border border-gray-200 rounded-3xl shadow-md p-6"
      >
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">
            My Sale Items
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Manage your listed products and update their details
          </p>
        </div>

        <div class="flex flex-wrap gap-3 mt-5 sm:mt-0">
          <!-- ปุ่ม Add -->
          <router-link
            to="/sale-items/add"
            class="px-6 py-2 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:scale-[1.02] shadow-sm transition-all duration-200"
          >
            + Add New Item
          </router-link>

          <!-- ปุ่ม Manage Brand -->
          <router-link
            to="/brands"
            class="px-6 py-2 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-200"
          >
            Manage Brand
          </router-link>
        </div>
      </div>

      <!-- Flash Message -->
      <div v-if="flash.message" :class="flash.style" class="mt-6">
        {{ flash.message }}
      </div>

      <!-- Sale Item List -->
      <div class="mt-5">
        <div
          v-if="!loading && saleItems.length === 0"
          class="p-16 text-center text-zinc-500 text-lg bg-zinc-900/50 border border-zinc-800 rounded-2xl"
        >
          No sale items found.
          <div class="mt-3 text-sm text-zinc-400">
            Click “Add New Item” to start listing your first product.
          </div>
        </div>

        <SaleItemList v-if="saleItems.length > 0" :items="saleItems" />
      </div>

      <!-- Pagination -->
      <div class="flex justify-center ">
        <Pagination
          :current-page="paginate.page"
          :total-pages="paginate.totalPages"
          @update:page="(page) => loadItems(page)"
          @go-to-last="handleGoToLast"
        />
      </div>
    </div>
  </div>
</template>
