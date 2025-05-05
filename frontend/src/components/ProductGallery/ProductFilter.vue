<script setup>
import { ref, computed } from "vue";
import brands from "@/mocks/brands.json";
import saleItems from "@/mocks/sale-items.json";

const props = defineProps({
  productCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const showFilters = ref(false);
const showSortOptions = ref(false);

const expandedSections = ref({
  brand: true,
  price: true,
  storage: false,
  ram: false,
  color: false,
  screenSize: false,
});

const selectedBrands = ref([]);
const selectedPriceRanges = ref([]);
const selectedStorage = ref([]);
const selectedRam = ref([]);
const selectedColors = ref([]);
const selectedScreenSizes = ref([]);

const priceRanges = [
  { label: "Under $300", value: "under-300" },
  { label: "$300 - $600", value: "300-600" },
  { label: "$600 - $1000", value: "600-1000" },
  { label: "$1000 - $1500", value: "1000-1500" },
  { label: "Over $1500", value: "over-1500" },
];

const storageOptions = computed(() => {
  const uniqueStorages = [...new Set(saleItems.map((item) => item.storageGb))];
  return uniqueStorages
    .sort((a, b) => a - b)
    .map((size) => ({
      label: `${size} GB`,
      value: size,
    }));
});

const ramOptions = computed(() => {
  const uniqueRam = [...new Set(saleItems.map((item) => item.ramGB))];
  return uniqueRam
    .sort((a, b) => a - b)
    .map((ram) => ({
      label: `${ram} GB`,
      value: ram,
    }));
});

const colorOptions = computed(() => {
  return [...new Set(saleItems.map((item) => item.color))].sort();
});

const screenSizeOptions = [
  { label: 'Under 5"', value: "under-5" },
  { label: '5" - 6"', value: "5-6" },
  { label: '6" - 6.5"', value: "6-6.5" },
  { label: 'Over 6.5"', value: "over-6.5" },
];

function toggleFilters() {
  showFilters.value = !showFilters.value;
  if (showFilters.value) {
    showSortOptions.value = false;
  }
}

function toggleSortOptions() {
  showSortOptions.value = !showSortOptions.value;
}

function toggleFilterSection(section) {
  expandedSections.value[section] = !expandedSections.value[section];
}

function applyFilters() {
  showFilters.value = false;
}

function sortBy(option) {
  showSortOptions.value = false;
}
</script>

<template>
  <div class="filter-container">
    <div
      class="flex justify-between items-center w-full py-4 px-4 bg-white border-b border-gray-200 text-black"
    >
      <div class="flex items-center">
        <button
          @click="toggleFilters"
          class="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded px-5 py-2 text-sm font-medium cursor-pointer"
        >
          FILTERS
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 6h18M6 12h12M9 18h6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div class="flex items-center">
        <div class="relative">
          <button
            @click="toggleSortOptions"
            class="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded px-5 py-2 text-sm font-medium cursor-pointer"
          >
            SORT BY
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div
            v-if="showSortOptions"
            class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 border border-gray-200 text-black"
          >
            <div class="py-1 cursor-pointer">
              <button
                @click="sortBy('relevance')"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Relevance
              </button>
              <button
                @click="sortBy('newest')"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Newest
              </button>
              <button
                @click="sortBy('price-low')"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Price: Low to High
              </button>
              <button
                @click="sortBy('price-high')"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Price: High to Low
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex justify-between items-center w-full py-3 px-4 bg-white text-black"
    >
      <div>
        <p class="text-sm">{{ productCount }} PRODUCTS</p>
      </div>
      <div class="flex gap-3">
        <button class="text-gray-800">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16v4H4V6zm0 8h16v4H4v-4z" />
          </svg>
        </button>
        <button class="text-gray-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="showFilters" class="filter-sidebar">
      <div
        class="filter-sidebar-header flex justify-between items-center p-4 border-b border-gray-200 text-black"
      >
        <h2 class="text-xl font-medium">Product Filters</h2>
        <button @click="toggleFilters" class="text-gray-500">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>
      </div>

      <div class="filter-sidebar-content overflow-y-auto text-black">
        <div class="filter-group border-b border-gray-200">
          <button
            @click="toggleFilterSection('brand')"
            class="flex justify-between items-center w-full p-4"
          >
            <span class="text-lg">Brand</span>
            <svg
              class="w-5 h-5 transform transition-transform"
              :class="{ 'rotate-180': expandedSections.brand }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
          <div v-if="expandedSections.brand" class="p-4 pt-0">
            <div v-for="brand in brands" :key="brand.brandId" class="mb-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedBrands"
                  :value="brand.brandId"
                  class="mr-2"
                />
                {{ brand.name }}
              </label>
            </div>
          </div>
        </div>

        <div class="filter-group border-b border-gray-200">
          <button
            @click="toggleFilterSection('price')"
            class="flex justify-between items-center w-full p-4"
          >
            <span class="text-lg">Price</span>
            <svg
              class="w-5 h-5 transform transition-transform"
              :class="{ 'rotate-180': expandedSections.price }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
          <div v-if="expandedSections.price" class="p-4 pt-0">
            <div
              v-for="(range, index) in priceRanges"
              :key="index"
              class="mb-2"
            >
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedPriceRanges"
                  :value="range.value"
                  class="mr-2"
                />
                {{ range.label }}
              </label>
            </div>
          </div>
        </div>

        <div class="filter-group border-b border-gray-200">
          <button
            @click="toggleFilterSection('storage')"
            class="flex justify-between items-center w-full p-4"
          >
            <span class="text-lg">Storage</span>
            <svg
              class="w-5 h-5 transform transition-transform"
              :class="{ 'rotate-180': expandedSections.storage }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
          <div v-if="expandedSections.storage" class="p-4 pt-0">
            <div
              v-for="(size, index) in storageOptions"
              :key="index"
              class="mb-2"
            >
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedStorage"
                  :value="size.value"
                  class="mr-2"
                />
                {{ size.label }}
              </label>
            </div>
          </div>
        </div>

        <div class="filter-group border-b border-gray-200">
          <button
            @click="toggleFilterSection('ram')"
            class="flex justify-between items-center w-full p-4"
          >
            <span class="text-lg">RAM</span>
            <svg
              class="w-5 h-5 transform transition-transform"
              :class="{ 'rotate-180': expandedSections.ram }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
          <div v-if="expandedSections.ram" class="p-4 pt-0">
            <div v-for="(ram, index) in ramOptions" :key="index" class="mb-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedRam"
                  :value="ram.value"
                  class="mr-2"
                />
                {{ ram.label }}
              </label>
            </div>
          </div>
        </div>

        <div class="filter-group border-b border-gray-200">
          <button
            @click="toggleFilterSection('color')"
            class="flex justify-between items-center w-full p-4"
          >
            <span class="text-lg">Color</span>
            <svg
              class="w-5 h-5 transform transition-transform"
              :class="{ 'rotate-180': expandedSections.color }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
          <div v-if="expandedSections.color" class="p-4 pt-0">
            <div
              v-for="(color, index) in colorOptions"
              :key="index"
              class="mb-2"
            >
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedColors"
                  :value="color"
                  class="mr-2"
                />
                {{ color }}
              </label>
            </div>
          </div>
        </div>

        <div class="filter-group border-b border-gray-200">
          <button
            @click="toggleFilterSection('screenSize')"
            class="flex justify-between items-center w-full p-4"
          >
            <span class="text-lg">Screen Size</span>
            <svg
              class="w-5 h-5 transform transition-transform"
              :class="{ 'rotate-180': expandedSections.screenSize }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
          <div v-if="expandedSections.screenSize" class="p-4 pt-0">
            <div
              v-for="(size, index) in screenSizeOptions"
              :key="index"
              class="mb-2"
            >
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedScreenSizes"
                  :value="size.value"
                  class="mr-2"
                />
                {{ size.label }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-sidebar-footer p-4 border-t border-gray-200">
        <button
          @click="applyFilters"
          class="w-full py-3 bg-black text-white font-medium rounded"
        >
          SHOW {{ productCount }} PRODUCTS
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  position: relative;
}

.filter-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background-color: white;
  z-index: 50;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.filter-sidebar-content {
  flex-grow: 1;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .filter-sidebar {
    width: 100%;
  }
}
</style>
