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
  <ProductCarousel />
  <ProductFilter />
  <div class="p-2 mb-5">
    <div
      v-if="sortedItems.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
    >
      <SaleItemCard
        v-for="item in sortedItems"
        :key="item.saleItemId"
        :item="item"
        :brand="getBrand(item.brandId)"
      />
    </div>
    <div v-else class="p-10 text-center text-gray-400 text-xl">
      No sale items available.
    </div>
  </div>
</template>
