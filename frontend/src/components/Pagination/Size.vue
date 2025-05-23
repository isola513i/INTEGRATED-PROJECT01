<template>
  <div class="flex items-center gap-2">
    <span class="text-sm font-semibold text-gray-700">Show</span>
    <div class="relative">
      <select
        v-model="pageSize"
        @change="handlePageSizeChange"
        class="appearance-none border border-gray-300 rounded-md py-1.5 px-3 pr-8 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option v-for="size in sizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
      <div class="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pageSize = ref(5);
const sizes = [5, 10, 20];

const emit = defineEmits(['update:pageSize']);

function handlePageSizeChange() {
  emit('update:pageSize', pageSize.value);
}
</script>