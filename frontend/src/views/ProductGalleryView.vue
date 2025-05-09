<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { fetchSaleItems } from "@/services/saleItemService";
import SaleItemCard from "@/components/ProductGallery/SaleItemCard.vue";
import ProductFilter from "@/components/ProductGallery/ProductFilter.vue";
import ProductCarousel from "@/components/ProductGallery/ProductCarousel.vue";
import PromoBar from "@/components/ProductGallery/PromoBar.vue";
import Breadcrumb from "@/components/Home/Breadcrumb.vue";

const saleItems = ref([]);
const loading = ref(true);
const router = useRouter();

onMounted(async () => {
  try {
    const data = await fetchSaleItems();
    saleItems.value = Array.isArray(data) ? data : [];
  } catch (err) {
    router.push("/server-error");
  } finally {
    loading.value = false;
  }
});

const productCount = computed(() => saleItems.value.length);

</script>

<template>
  <div class="min-h-screen bg-white">
    <PromoBar />
    <ProductCarousel />
    <Breadcrumb />
    <div class="itmbs-sale-item-add pt-4 px-4">
    <router-link to="">
        <button @click="handleClick"
        class="flex items-center gap-2 border border-gray-300 bg-white text-black font-semibold py-2 px-4 rounded shadow-sm hover:bg-gray-100"
      >
      Add Sale Item
    </button>
    </router-link>
    </div>
    <ProductFilter :productCount="productCount" />
    
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
      <div v-else-if="loading" class="p-10 text-center text-gray-400 text-xl">
        Loading...
      </div>
      <div v-else class="p-10 text-center text-gray-400 text-xl">
        No sale item
      </div>
    </div>

  
</template>
