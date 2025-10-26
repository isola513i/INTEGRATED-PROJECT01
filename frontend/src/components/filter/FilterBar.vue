<script setup>
import FilterBrands from "./FilterBrands.vue";
import FilterPrice from "./FilterPrice.vue";
import FilterStorageSize from "./FilterStorageSize.vue";
import PageSize from "../Pagination/PageSize.vue";
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

  emit("update:brands", []);
  emit("update:price", null);
  emit("update:storage", []);
  emit("update:pageSize", 10);
}
</script>

<template>
  <div
    class="w-full flex flex-col gap-4 md:gap-6 md:flex-row md:items-start md:justify-between"
  >
    <!-- Left: filter group -->
    <div
      class="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-5"
    >
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-gray-200"
      >
        <!-- Brand -->
        <div class="flex flex-col items-center text-center px-2">
          
          <FilterBrands
            :clearAllTrigger="clearAllFlag"
            @update:brands="emit('update:brands', $event)"
          />
        </div>

        <!-- Price -->
        <div class="flex flex-col items-center text-center px-2">
          
          <FilterPrice
            :clearAllTrigger="clearAllFlag"
            @update:price="emit('update:price', $event)"
          />
        </div>

        <!-- Storage -->
        <div class="flex flex-col items-center text-center px-2">
          
          <FilterStorageSize
            :clearAllTrigger="clearAllFlag"
            @update:storage="emit('update:storage', $event)"
          />
        </div>

        <!-- Clear -->
        <div
          class="flex flex-col items-center justify-center text-center px-2"
        >
          
          <button
            @click="clearAll"
            class="inline-flex items-center rounded-xl border border-gray-300 text-gray-700 text-sm font-medium px-3 py-1.5 hover:bg-gray-100 hover:shadow-sm transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Right: page size -->
    <div
      class="md:w-auto w-full flex md:block items-center justify-between md:justify-end"
    >
      <div
        class="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3 w-full md:w-auto"
      >
    

        <PageSize
          v-model="pageSize"
          @update:modelValue="emit('update:pageSize', $event)"
        />
      </div>
    </div>
  </div>
</template>
