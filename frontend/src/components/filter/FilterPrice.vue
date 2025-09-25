<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  clearAllTrigger: { type: Boolean, default: false },
});

const emit = defineEmits(["update:price"]);

const selectedPrice = ref({ min: null, max: null });
const showPriceDropdown = ref(false);

const priceOptions = ref([
  { label: "0 - 5,000 Baht", min: 0, max: 5000 },
  { label: "5,001 - 10,000 Baht", min: 5001, max: 10000 },
  { label: "10,001 - 20,000 Baht", min: 10001, max: 20000 },
  { label: "20,001 - 30,000 Baht", min: 20001, max: 30000 },
  { label: "30,001 - 40,000 Baht", min: 30001, max: 40000 },
  { label: "40,001 - 50,000 Baht", min: 40001, max: 50000 }
]);

onMounted(() => {
  const stored = sessionStorage.getItem("selectedPrice");
  if (stored) {
    selectedPrice.value = JSON.parse(stored);
    emit("update:price", selectedPrice.value);
  }
});

watch(
  () => props.clearAllTrigger,
  (val) => {
    if (val) removePrice();
  }
);

function togglePriceDropdown() {
  showPriceDropdown.value = !showPriceDropdown.value;
}

function removePrice() {
  selectedPrice.value = { min: null, max: null };
  emit("update:price", selectedPrice.value);
  sessionStorage.removeItem("selectedPrice");
}

// เมื่อกรอก input ให้ update ทันที
function updateCustomPrice() {
  emit("update:price", selectedPrice.value);
  sessionStorage.setItem("selectedPrice", JSON.stringify(selectedPrice.value));
}
</script>

<template>
  <div
    class="relative w-full text-center cursor-pointer"
    @click="togglePriceDropdown"
  >
    <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Price</p>

    <!-- Selected chip -->
    <div class="flex flex-nowrap overflow-x-auto gap-1 mt-1 max-w-full whitespace-nowrap items-center justify-center min-h-[28px]">
      <template v-if="selectedPrice.min !== null || selectedPrice.max !== null">
        <span class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border border-slate-200">
          {{
            priceOptions.find(p => p.min === selectedPrice?.min && p.max === selectedPrice?.max)?.label
            || `${selectedPrice.min || 0} - ${selectedPrice.max || "∞"} Baht`
          }}
          <button
            @click.stop="removePrice"
            class="text-slate-500 hover:text-red-500 font-bold leading-none"
            aria-label="Clear price"
          >
            ×
          </button>
        </span>
      </template>
      <template v-else>
        <span class="text-gray-500 text-xs">Filter by Price</span>
      </template>
    </div>

    <!-- Dropdown -->
    <div
      v-if="showPriceDropdown"
      class="absolute mt-2 bg-white text-black border border-gray-300 rounded-lg shadow-lg z-50 w-full sm:w-64 max-h-60 overflow-auto p-1"
      @click.stop
    >
      <!-- Preset options -->
      <div
        v-for="option in priceOptions"
        :key="option.label"
        class="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm"
        @click="selectedPrice = { min: option.min, max: option.max }; updateCustomPrice()"
      >
        {{ option.label }}
      </div>

      <hr class="border-gray-200 my-2">

      <!-- Custom min/max -->
      <div class="flex gap-2 px-1 pb-1">
        <input
          type="number"
          v-model.number="selectedPrice.min"
          placeholder="Min"
          class="border border-gray-300 rounded px-2 py-1 w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          @input="updateCustomPrice"
        />
        <input
          type="number"
          v-model.number="selectedPrice.max"
          placeholder="Max"
          class="border border-gray-300 rounded px-2 py-1 w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          @input="updateCustomPrice"
        />
      </div>
    </div>
  </div>
</template>
