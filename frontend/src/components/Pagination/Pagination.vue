<script setup>
import { ref, computed, watch, toRefs } from "vue";

// Props
const props = defineProps({
  currentPage: { type: Number },
  totalPages: { type: Number },
});

// Emit
const emit = defineEmits(["update:page","go-to-last"]);

const pageGroupStart = ref(0);

// คำนวณกลุ่มของหน้า

// เปลี่ยนหน้า
const goToPage = (page) => {
  emit("update:page", page);

  if (page < pageGroupStart.value) {
    pageGroupStart.value = page;
  } else if (page >= pageGroupStart.value + 10) {
    pageGroupStart.value = Math.max(0, page - 9);
  }
};
const goFirst = () => {
  emit("update:page", 0);
  pageGroupStart.value = 0;
};
const goToLast = () => {
  emit("go-to-last");
};
// ถ้า currentPage เปลี่ยนจาก parent (เช่น เปลี่ยน filter) ให้ sync กลุ่ม
watch(
  () => props.currentPage,
  (val) => {
    if (val < pageGroupStart.value || val >= pageGroupStart.value + 10) {
      pageGroupStart.value = Math.max(1, val - 4);
    }
  },
);
const visiblePages = computed(() => {
  const start = pageGroupStart.value;
  const end = Math.min(start + 9, props.totalPages - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});
</script>
<template>
  <div
    v-show="totalPages !== 1"
    class="mt-6 flex flex-wrap justify-center items-center gap-2 text-sm sm:text-xs md:text-sm"
  >
    <!-- First (hidden on mobile) -->
    <button
      @click="goFirst()"
      :disabled="currentPage === 0"
      class="hidden sm:inline-block itbms-page-first px-3 py-1.5 md:px-3 md:py-1.5 rounded-full border text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      « First
    </button>

    <!-- Prev -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 0"
      class="itbms-page-prev px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      ‹ Prev
    </button>

    <!-- Page Numbers -->
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="goToPage(page)"
      :class="[
        `itbms-page-${page} px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border cursor-pointer`,
        page === currentPage
          ? 'bg-[#171717] text-white font-bold'
          : 'bg-white text-gray-700 hover:bg-gray-100',
      ]"
    >
      {{ page + 1 }}
    </button>

    <!-- Next -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage + 1 === totalPages"
      class="itbms-page-next px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      Next ›
    </button>


    <!-- Last (hidden on mobile) -->
    <button
      @click="goToLast"
      :disabled="currentPage + 1 === totalPages"
      class="hidden sm:inline-block itbms-page-last px-3 py-1.5 md:px-3 md:py-1.5 rounded-full border text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      Last »
    </button>
  </div>
</template>
