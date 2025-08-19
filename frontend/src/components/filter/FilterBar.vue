<script setup>
//import FilterBrand from "./FilterBrand.vue";
import FilterBrands from "./FilterBrands.vue";
import FilterPrice from "./FilterPrice.vue";
import FilterStorageSize from "./FilterStorageSize.vue";
import { nextTick, ref } from "vue";

const emit = defineEmits([
  "update:brands",
  "update:price",
  "update:storage",
  "update:pageSize",
]);
const clearAllFlag = ref(false);

const pageSize = ref(parseInt(sessionStorage.getItem("pageSize")) || 10);
function clearAll() {
  sessionStorage.removeItem("selectedPrice");
  sessionStorage.removeItem("filterStorage");
  sessionStorage.removeItem("filterBrands");
  pageSize.value = 10;
  clearAllFlag.value = true;
  nextTick(() => (clearAllFlag.value = false));

  // ส่งค่า reset ไป parent
  emit("update:brands", []);
  emit("update:price", null);
  emit("update:storage", []);
}
</script>

<template>
  <div class="flex items-center">
    <div
      class="flex items-center justify-between flex-wrap gap-3 bg-gray-100 rounded-full shadow px-4 py-2 w-full max-w-4xl mt-6 mx-auto"
    >
      <FilterBrands
        :clearAllTrigger="clearAllFlag"
        @update:brands="emit('update:brands', $event)"
      />
      <FilterPrice
        :clearAllTrigger="clearAllFlag"
        @update:price="emit('update:price', $event)"
      />
      <FilterStorageSize
        :clearAllTrigger="clearAllFlag"
        @update:storage="emit('update:storage', $event)"
      />

      <button
        @click="clearAll"
        class="text-black bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex-shrink-0"
      >
        Clear
      </button>
    </div>
    <div class="flex items-center gap-2 h-[42px]">
      <label for="pageSize" class="text-gray-700 text-sm cursor-pointer"
        >Show :</label
      >
      <select
        id="pageSize"
        v-model="pageSize"
        @change="emit('update:pageSize', Number(pageSize))"
        class="border border-gray-300 px-3 h-full rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
    </div>
  </div>
</template>
