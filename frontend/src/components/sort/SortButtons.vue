<script setup>
const props = defineProps({
  selected: String,
});
const emit = defineEmits(["update:sort"]);

const setSort = (value) => {
  emit("update:sort", value);
};
</script>

<template>
  <div class="flex gap-1">
    <button
      class="p-2 rounded border hover:bg-gray-100 transition flex items-center justify-center cursor-pointer itbms-brand-none"
      :class="
        selected === 'none'
          ? 'bg-gray-200 border-gray-300'
          : 'bg-white border-gray-200'
      "
      @click="setSort('none')"
    >
      <img
        src="@/assets/images/sort/sortNone.png"
        alt="Default sort"
        class="w-5 h-5"
      />
    </button>

    <button
      class="p-2 rounded border hover:bg-gray-100 transition flex items-center justify-center cursor-pointer itbms-brand-asc"
      :class="
        selected === 'asc'
          ? 'bg-blue-100 border-blue-200'
          : 'bg-white border-gray-200'
      "
      @click="setSort('asc')"
    >
      <img
        src="@/assets/images/sort/sortASC.png"
        alt="Sort A-Z"
        class="w-5 h-5"
      />
    </button>

    <button
      class="p-2 rounded border hover:bg-gray-100 transition flex items-center justify-center cursor-pointer itbms-brand-desc"
      :class="
        selected === 'desc'
          ? 'bg-blue-100 border-blue-200'
          : 'bg-white border-gray-200'
      "
      @click="setSort('desc')"
    >
      <img
        src="@/assets/images/sort/sortDSC.png"
        alt="Sort Z-A"
        class="w-5 h-5"
      />
    </button>
  </div>
</template>
