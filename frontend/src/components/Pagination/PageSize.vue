<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Number, default: 10 },
});
const emit = defineEmits(["update:modelValue"]);
const pageSize = ref(props.modelValue);

// sync จาก parent -> local
watch(
  () => props.modelValue,
  (v) => {
    pageSize.value = v;
  }
);

watch(pageSize, (v) => {
  const n = Number(v);
  emit("update:modelValue", n);
  sessionStorage.setItem("pageSize", String(n));
});
</script>

<template>
  <div class="flex items-center gap-2 h-10 flex-shrink-0 whitespace-nowrap">
    <label
      for="pageSize"
      class="text-gray-700 text-sm cursor-pointer leading-none"
    >
      Show :
    </label>
    <div class="relative">
      <select
        id="pageSize"
        v-model="pageSize"
        class="appearance-none w-auto h-10 px-4 pr-9 rounded-lg border border-gray-300 bg-white text-gray-800 text-base leading-none cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="15">15</option>
        <option :value="20">20</option>
      </select>
      <div
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
