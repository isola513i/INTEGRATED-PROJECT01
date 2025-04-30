<script setup>
import { ref, onMounted, computed } from 'vue';
import SaleItemCard from '@/components/SaleItemCard.vue';
import saleItemsMock from '@/mocks/sale-items.json';

const saleItems = ref([]);

onMounted(() => {
  saleItems.value = saleItemsMock;
});

const sortedItems = computed(() => {
  return [...saleItems.value].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
});
</script>

<template>
  <div class="p-4">
    <div v-if="saleItems.length === 0" class="text-center text-gray-500">
      No sale items available.
    </div>
    <div v-else class="grid grid-cols-5 gap-4">
      <SaleItemCard v-for="item in sortedItems" :key="item.id" :item="item" />
     
    </div>
  </div>
</template>
