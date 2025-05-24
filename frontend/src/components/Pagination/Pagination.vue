<script setup>
import { ref, computed, watch, toRefs } from "vue";

// Props
const props = defineProps({
  currentPage: { type: Number },
  totalPages: { type: Number },
});

// Emit
const emit = defineEmits(["update:page"]);

const pageGroupStart = ref(1);

// คำนวณกลุ่มของหน้า

// เปลี่ยนหน้า
const goToPage = (page) => {
  emit("update:page", page);

  // Auto shift page group ถ้ากดไปท้ายหรือหน้าแรกของกลุ่ม
  if (page === pageGroupStart.value + 9 && page < props.totalPages) {
    pageGroupStart.value += 1;
  } else if (page === pageGroupStart.value && page > 1) {
    pageGroupStart.value -= 1;
  }
};

const goFirst = () => {
  emit("update:page", 1);
  pageGroupStart.value = 1;
};


// ถ้า currentPage เปลี่ยนจาก parent (เช่น เปลี่ยน filter) ให้ sync กลุ่ม
watch(
  () => props.currentPage,
  (val) => {
    if (val < pageGroupStart.value || val > pageGroupStart.value + 9) {
      pageGroupStart.value = Math.max(1, val - 4);
    }
  },
);
</script>
<template>
  <div class="mt-6 flex flex-wrap justify-center items-center gap-2 text-sm">
    <button
      @click="goToPage(0)"
      :disabled="currentPage === 0"
      class="px-3 py-1.5 rounded-full border text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      « First
    </button>

    <button
      @click="goToPage(currentPage-1)"
      :disabled="currentPage === 0"
      class="px-3 py-1.5 rounded-full border text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      ‹ Prev
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      @click="goToPage(page -1 )"
      :class="[
        'px-3 py-1.5 rounded-full border',
        page - 1 === currentPage ? 'bg-blue-600 text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-100',
      ]"
    >
      {{ page }}
    </button>
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage + 1 === totalPages"
      class="px-3 py-1.5 rounded-full border text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next ›
    </button>

    <button
      @click="goToPage(totalPages-1)"
      :disabled="currentPage +1 === totalPages"
      class="px-3 py-1.5 rounded-full border text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Last »
    </button>
  </div>
</template>
