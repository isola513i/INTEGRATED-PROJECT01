<script setup>
import FilterBrands from "./FilterBrands.vue";
import FilterPrice from "./FilterPrice.vue";
import FilterStorageSize from "./FilterStorageSize.vue";
import PageSize from "../Pagination/PageSize.vue"; // 👈 import ใหม่
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
  emit("update:pageSize", 10);
}
</script>

<template>
  <div class="flex flex-col md:flex-row w-full gap-3">
    <!-- แถบฟิลเตอร์ -->
    <div class="flex-1">
      <div class="bg-gray-100 rounded-2xl shadow mt-6">
        <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-300">
          <div class="p-3 flex flex-col items-center justify-center">
            <FilterBrands
              :clearAllTrigger="clearAllFlag"
              @update:brands="emit('update:brands', $event)"
            />
          </div>
          <div class="p-3 flex flex-col items-center justify-center">
            <FilterPrice
              :clearAllTrigger="clearAllFlag"
              @update:price="emit('update:price', $event)"
            />
          </div>
          <div class="p-3 flex flex-col items-center justify-center">
            <FilterStorageSize
              :clearAllTrigger="clearAllFlag"
              @update:storage="emit('update:storage', $event)"
            />
          </div>
          <div class="p-3 flex items-center justify-center">
            <button
              @click="clearAll"
              class="text-black  hover:bg-gray-200 rounded-full px-3 py-2"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- PageSize -->
    <div class="self-center md:self-start mt-3 md:mt-6 md:ml-auto">
      <PageSize
        v-model="pageSize"
        @update:modelValue="emit('update:pageSize', $event)"
      />
    </div>
  </div>
</template>
