<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { fetchSaleItems } from '@/services/saleItemService';
import SaleItemCard from '@/components/ProductGallery/SaleItemCard.vue';
import ProductFilter from '@/components/ProductGallery/ProductFilter.vue';
import ProductCarousel from '@/components/ProductGallery/ProductCarousel.vue';
import PromoBar from '@/components/ProductGallery/PromoBar.vue';

const saleItems = ref([]);
const loading = ref(true);
const router = useRouter();

onMounted(async () => {
  try {
    const data = await fetchSaleItems();
    saleItems.value = Array.isArray(data) ? data : [];
  } catch (err) {
    router.push('/server-error');
  } finally {
    loading.value = false;
  }
});

const sortedItems = computed(() => {
  if (!Array.isArray(saleItems.value)) return [];
  return saleItems.value.slice().sort((a, b) => {
    const brandA = a.brandName || '';
    const brandB = b.brandName || '';
    return brandA.localeCompare(brandB);
  });
});

const productCount = computed(() => saleItems.value.length);
</script>

<template>
  <div class="min-h-screen bg-white">
    <PromoBar />
    <ProductCarousel />
    <ProductFilter :productCount="productCount" />
    <div class="px-4 py-2">
      <div
        v-if="sortedItems.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <SaleItemCard
          class="itbms-row"
          v-for="item in sortedItems"
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
  </div>
</template>
