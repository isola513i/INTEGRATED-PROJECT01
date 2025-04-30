<template>
  <div
    class="w-80 h-[420px] bg-white p-6 flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-gray-50 cursor-pointer"
  >
    <h2 class="text-xl font-semibold text-gray-800 mb-2 text-center">
      {{ brand.name }}
    </h2>
    <p class="text-sm text-gray-500 mb-1 text-center">{{ item.model }}</p>
    <p class="text-sm text-gray-500 mb-1 text-center">{{ item.storageGb }}GB</p>
    <p class="text-sm text-gray-500 mb-1 text-center">
      ฿{{ item.price.toFixed(2) }}
    </p>
    <img
      :src="brand.logoUrl"
      alt="Brand Image"
      class="w-100 h-100 object-contain mb-4"
    />
  </div>
</template>

<script>
export default {
  name: 'SaleItemCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
    brand: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped></style>
