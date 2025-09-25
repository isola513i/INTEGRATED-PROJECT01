<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Number, default: 10 },
});
const emit = defineEmits(["update:modelValue"]);
const pageSize = ref(props.modelValue);

watch(() => props.modelValue, v => { pageSize.value = v; });
watch(pageSize, v => {
  const n = Number(v);
  emit("update:modelValue", n);
  sessionStorage.setItem("pageSize", String(n));
});
</script>

<template>
  <div class="flex items-center gap-2 h-10 flex-shrink-0 whitespace-nowrap">
    <label for="pageSize" class="text-gray-700 text-sm cursor-pointer leading-none">
      Show :
    </label>


    <select
      id="pageSize"
      v-model="pageSize"
      class="border border-gray-300 px-3 h-9 rounded-lg text-gray-700 text-sm
             focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer leading-none"
    >
      <option :value="5">5</option>
      <option :value="10">10</option>
      <option :value="15">15</option>
      <option :value="20">20</option>
    </select>
  </div>
</template>
