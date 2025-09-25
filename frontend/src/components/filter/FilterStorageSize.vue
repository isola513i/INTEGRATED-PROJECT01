<script setup>
import { ref, watch, onMounted } from "vue";
import { fetchStorage } from "@/services/storageService";

const emit = defineEmits(["update:storage"]);

const props = defineProps({
  clearAllTrigger: { type: Boolean, default: false },
});

const selectedStorage = ref([]);
const showStorageDropdown = ref(false);
const storageOptions = ref([]);

// โหลดค่า sessionStorage + storage options ตอน mounted
onMounted(async () => {
  const stored = JSON.parse(sessionStorage.getItem("filterStorage") || "[]");
  selectedStorage.value = stored;
  emit("update:storage", selectedStorage.value);

  // ดึงข้อมูลจาก API
  storageOptions.value = await fetchStorage();
});

watch(
  () => props.clearAllTrigger,
  (val) => {
    if (val) {
      selectedStorage.value = [];
      emit("update:storage", []);
      sessionStorage.removeItem("filterStorage");
    }
  }
);

function isStorageChecked(value) {
  return selectedStorage.value.includes(value);
}

function toggleStorage(option) {
  if (selectedStorage.value.includes(option.value)) {
    selectedStorage.value = selectedStorage.value.filter(
      (v) => v !== option.value
    );
  } else {
    selectedStorage.value = [...selectedStorage.value, option.value];
  }
  emit("update:storage", selectedStorage.value);
  sessionStorage.setItem(
    "filterStorage",
    JSON.stringify(selectedStorage.value)
  );
}

function removeStorage(index) {
  selectedStorage.value.splice(index, 1);
  emit("update:storage", selectedStorage.value);
  sessionStorage.setItem(
    "filterStorage",
    JSON.stringify(selectedStorage.value)
  );
}

function formatStorage(size) {
  if (size === -1) return "Not specified";
  if (size >= 1000) {
    const tb = size / 1000;
    return Number.isInteger(tb) ? `${tb} TB` : `${tb.toFixed(1)} TB`;
  }
  return `${size} GB`;
}

function toggleDropdown() {
  showStorageDropdown.value = !showStorageDropdown.value;
}
</script>

<template>
  <div
    class="relative w-full text-center cursor-pointer"
    @click.stop="toggleDropdown"
  >
    <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Storage</p>

    <!-- Selected chips -->
    <div class="flex flex-nowrap overflow-x-auto gap-1 mt-1 max-w-full whitespace-nowrap items-center justify-center min-h-[28px]">
      <template v-if="selectedStorage.length">
        <span
          v-for="(s, index) in selectedStorage"
          :key="s"
          class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 flex-shrink-0 border border-slate-200"
        >
          {{ formatStorage(s) }}
          <button
            @click.stop="removeStorage(index)"
            class="text-slate-500 hover:text-red-500 font-bold leading-none"
            aria-label="Remove storage"
          >
            ×
          </button>
        </span>
      </template>
      <template v-else>
        <span class="text-gray-500 text-xs">Filter by storage</span>
      </template>
    </div>

    <!-- Dropdown -->
    <div
      v-if="showStorageDropdown"
      class="absolute mt-2 bg-white text-black border border-gray-300 rounded-lg shadow-lg z-50 w-full sm:w-64 max-h-60 overflow-auto p-1"
      @click.stop
    >
      <div
        v-for="option in storageOptions"
        :key="option.value"
        class="px-3 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer rounded"
        @click="toggleStorage(option)"
      >
        <input
          type="checkbox"
          :checked="isStorageChecked(option.value)"
          @change.stop="toggleStorage(option)"
        />
        <span class="text-sm">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>
