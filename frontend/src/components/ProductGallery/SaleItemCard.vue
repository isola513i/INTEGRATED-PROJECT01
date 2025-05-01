<script>
export default {
  name: "SaleItemCard",
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

<template>
  <router-link :to="`/sale-items/${item.saleItemId}`" class="no-underline">
    <div
      class="Itbms-row w-80 bg-white p-6 flex flex-col items-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-black-50 cursor-pointer rounded-lg relative overflow-hidden"
    >
      <div
        class="flex items-center justify-center w-full h-48 mt-auto transition-opacity duration-300"
      >
        <img
          :src="brand.logoUrl"
          alt="Brand Image"
          class="w-40 h-40 object-contain transition-all duration-300"
        />
      </div>
      <h2
        class="Itbms-brand text-xl font-semibold text-gray-800 mb-2 text-center"
      >
        {{ brand.name }}
      </h2>
      <p class="Itbms-model text-sm text-gray-500 mb-1 text-center">
        {{ item.model }}
      </p>
      <p
        class="Itbms-ramGb itbms-storageGb text-sm text-gray-500 mb-1 text-center"
      >
        {{ item.ramGB }}<span class="Itbms-ramGb-unit">GB</span> /
        {{ item.storageGb }}<span class="Itbms-storageGb-unit">GB</span>
      </p>
      <p class="Itbms-price text-sm text-gray-500 mb-4 text-center">
        ฿<span class="Itbms-price-unit">{{ item.price.toFixed(2) }}</span>
      </p>
    </div>
  </router-link>
</template>

<style scoped></style>
