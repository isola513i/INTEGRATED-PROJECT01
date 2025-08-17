<!-- <script setup>
import { ref, watch, onMounted } from "vue";

const emit = defineEmits(["update:pageSize"]);

const pageSize = ref(10);

onMounted(() => {
  pageSize.value = parseInt(sessionStorage.getItem("pageSize")) || 10;
});

watch(pageSize, (newVal) => {
  emit("update:pageSize", Number(newVal));
  sessionStorage.setItem("pageSize", newVal);
});
</script>

<template>
  <div class="flex items-center gap-2 h-[42px] mt-2">
    <label for="pageSize" class="text-gray-700 text-sm cursor-pointer">
      Page size:
    </label>
    <select
      id="pageSize"
      v-model="pageSize"
      class="border border-gray-300 px-3 h-full rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer"
    >
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="15">15</option>
      <option value="20">20</option>
    </select>
  </div>
</template> -->
