<!-- <script setup>
import BrandFilter from "./BrandFilter.vue";
import PriceFilter from "./PriceFilter.vue";
import StorageFilter from "./StorageFilter.vue";
import PageSizeSelector from "./PageSizeSelector.vue";

const emit = defineEmits([
  "update:brands",
  "update:pageSize",
  "update:price",
  "update:storage",
]);

function clearAll() {
  emit("update:brands", []);
  emit("update:price", null);
  emit("update:storage", []);
}
</script>

<template>
  <div class="flex items-center">
    <div
      class="flex items-center bg-gray-100 rounded-full shadow px-4 py-2 w-full max-w-4xl mt-6 mx-auto"
    >
      <BrandFilter @update:brands="emit('update:brands', $event)" />
      <PriceFilter @update:price="emit('update:price', $event)" />
      <StorageFilter @update:storage="emit('update:storage', $event)" />
      
      <button
        @click="clearAll"
        class="ml-3 bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex-shrink-0"
      >
        Clear
      </button>
    </div>
    <PageSizeSelector @update:pageSize="emit('update:pageSize', $event)" />
  </div>
</template> -->
