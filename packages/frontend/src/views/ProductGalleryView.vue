<script setup>
import { computed } from 'vue';
import SaleItemCard from '@/components/SaleItemCard.vue';
import saleItems from '@/mocks/sale-items.json';
import brands from '@/mocks/brands.json';
import ProductFilter from '@/components/ProductFilter.vue';
import ProductCarousel from '@/components/ProductCarousel.vue';

const sortedItems = computed(() => {
  return saleItems
    .slice()
    .sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));
});

function getBrand(brandId) {
  return brands.find((b) => b.brandId === brandId) || {};
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <ProductCarousel />
    <ProductFilter />
    <div class="px-4 py-2">
      <div
        v-if="sortedItems.length"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <SaleItemCard
          v-for="item in sortedItems"
          :key="item.saleItemId"
          :item="item"
          :brand="getBrand(item.brandId)"
        />
      </div>
      <div v-else class="p-10 text-center text-gray-400 text-xl">
        No products available.
      </div>
    </div>
  </div>
</template>
