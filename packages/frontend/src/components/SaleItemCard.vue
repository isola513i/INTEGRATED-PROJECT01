<script setup>
defineProps({
  item: Object,
});
</script>

<template>
  <div class="border p-4 rounded shadow bg-white flex flex-col gap-2 Itbms-row">
    <div class="text-lg font-semibold Itbms-model">{{ item.model }}</div>
    <div class="text-sm text-gray-600 Itbms-brand">{{ item.brandName }}</div>
    <div class="text-sm text-gray-800 Itbms-storageGb">
      {{ item.storageGB }}
      <span class="Itbms-storageGb-unit">GB</span>
    </div>
    <div class="text-sm text-gray-900 font-bold Itbms-price">
      {{ item.price.toLocaleString() }}
      <span class="Itbms-price-unit">THB</span>
    </div>
  </div>
</template>
