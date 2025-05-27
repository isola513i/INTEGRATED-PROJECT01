<script>
import defaultImage from "@/assets/images/brands/default.png";

export default {
  name: "SaleItemCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultImage,
    };
  },
};
</script>

<template>
  <router-link :to="`/sale-items/${item.id}`" class="no-underline">
    <div
      class="itbms-row w-full sm:w-auto bg-white p-4 sm:p-6 flex flex-col items-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-black-50 cursor-pointer rounded-lg relative overflow-hidden"
    >
      <div class="flex items-center justify-center w-full h-40 sm:h-48 mt-auto">
        <img
          :src="defaultImage"
          :alt="item.brandName"
          class="w-24 h-24 sm:w-40 sm:h-40 object-contain transition-all duration-300"
        />
      </div>

      <h2 class="itbms-brand text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">
        {{ item.brandName }}
      </h2>
      <p class="itbms-model text-sm text-gray-500 mb-1 text-center">
        {{ item.model }}
      </p>
      <p class="text-sm text-gray-500 mb-1 text-center">
        <span class="itbms-ramGb">{{ item.ramGb || "-" }}</span>
        <span> / </span>
        <span class="itbms-storageGb">{{ item.storageGb || "-" }}</span>
        <span class="itbms-storageGb-unit"> GB</span>
      </p>
      <p class="itbms-price text-sm text-gray-500 mb-4 text-center">
        ฿<span class="itbms-price-unit">
          {{
            Number(item.price).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </p>
    </div>
  </router-link>
</template>
