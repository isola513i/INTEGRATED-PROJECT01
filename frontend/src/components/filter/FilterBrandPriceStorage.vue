<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { fetchBrands } from "@/services/brandService";

const emit = defineEmits([
  "update:brands",
  "update:pageSize",
  "update:price",
  "update:storage",
]);

const pageSize = ref(parseInt(sessionStorage.getItem("pageSize")) || 10);

// --- Brand ---
const selectedBrands = ref([]);
const brandOptions = ref([]);
const showBrandDropdown = ref(false);

// --- Price ---
const selectedPrice = ref(null);
const priceOptions = ref([
  { label: "0 - 5,000 Baht", min: 0, max: 5000 },
  { label: "5,001 - 10,000 Baht", min: 5001, max: 10000 },
  { label: "10,001 - 20,000 Baht", min: 10001, max: 20000 },
  { label: "20,001 - 30,000 Baht", min: 20001, max: 30000 },
  { label: "30,001 - 40,000 Baht", min: 30001, max: 40000 },
  { label: "40,001 - 50,000 Baht", min: 40001, max: 50000 },
  { label: "50,001+ Baht", min: 50001, max: null },
]);
const showPriceDropdown = ref(false);

// --- Storage ---
const selectedStorage = ref([]);
const storageOptions = ref([
  { label: "32 GB", value: "32" },
  { label: "64 GB", value: "64" },
  { label: "128 GB", value: "128" },
  { label: "256 GB", value: "256" },
  { label: "512 GB", value: "512" },
  { label: "1 TB", value: "1000" },
]);
const showStorageDropdown = ref(false);

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
}

// --- Load saved filters ---
const filteredBrands = JSON.parse(
  sessionStorage.getItem("filterBrands") || "[]"
);

onMounted(async () => {
  const brands = await fetchBrands();

  filteredBrands.forEach((name) => {
    const match = brands.find((b) => b.name === name);
    if (
      match &&
      !selectedBrands.value.some((b) => b.brandId === match.brandId)
    ) {
      selectedBrands.value.push({ brandId: match.brandId, name: match.name });
    }
  });
  brandOptions.value = brands.filter(
    (b) => b.name.toLowerCase() !== "filter by brand"
  );

  const savedPrice = JSON.parse(sessionStorage.getItem("selectedPrice"));
  if (savedPrice) selectedPrice.value = savedPrice;

  const savedStorage = JSON.parse(
    sessionStorage.getItem("selectedStorage") || "[]"
  );
  selectedStorage.value = savedStorage;
});

// --- Click outside to close dropdown ---
const dropdownRef = ref(null);
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showBrandDropdown.value = false;
    showPriceDropdown.value = false;
    showStorageDropdown.value = false;
  }
}
onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);

// --- Watchers ---
watch(pageSize, (newVal) => emit("update:pageSize", Number(newVal)));
watch(selectedBrands, () =>
  emit(
    "update:brands",
    selectedBrands.value.map((b) => b.name)
  )
);
watch(selectedPrice, (newVal) => {
  emit("update:price", newVal);
  if (newVal) sessionStorage.setItem("selectedPrice", JSON.stringify(newVal));
  else sessionStorage.removeItem("selectedPrice");
});
watch(selectedStorage, (newVal) => {
  emit("update:storage", newVal);
  sessionStorage.setItem("selectedStorage", JSON.stringify(newVal));
});

// --- Functions ---
function toggleBrandDropdown() {
  showBrandDropdown.value = !showBrandDropdown.value;
}
function togglePriceDropdown() {
  showPriceDropdown.value = !showPriceDropdown.value;
}
function isBrandChecked(brandId) {
  return selectedBrands.value.some((b) => b.brandId === brandId);
}
function toggleBrand(brand) {
  const exists = selectedBrands.value.find((b) => b.brandId === brand.brandId);
  if (exists)
    selectedBrands.value = selectedBrands.value.filter(
      (b) => b.brandId !== brand.brandId
    );
  else
    selectedBrands.value = [
      ...selectedBrands.value,
      { brandId: brand.brandId, name: brand.name },
    ];
}
function selectPrice(option) {
  selectedPrice.value = { min: option.min, max: option.max };
  showPriceDropdown.value = false;
}
function removeBrand(index) {
  selectedBrands.value.splice(index, 1);
  emit(
    "update:brands",
    selectedBrands.value.map((b) => b.name)
  );
}
function removePrice() {
  selectedPrice.value = null;
  emit("update:price", { min: null, max: null }); // ส่ง object แทน
  sessionStorage.removeItem("selectedPrice");
}

function removeStorage(index) {
  selectedStorage.value.splice(index, 1);
  emit("update:storage", selectedStorage.value);
  sessionStorage.setItem(
    "selectedStorage",
    JSON.stringify(selectedStorage.value)
  );
}
function formatStorage(size) {
  if (size >= 1000) {
    const tb = size / 1000;
    return Number.isInteger(tb) ? `${tb} TB` : `${tb.toFixed(1)} TB`;
  }
  return `${size} GB`;
}
function clearAll() {
  selectedBrands.value = [];
  selectedStorage.value = [];
}
</script>

<template>
  <div>
    <div class="flex items-center">
      <div
        class="flex items-center bg-gray-100 rounded-full shadow px-4 py-2 w-full max-w-4xl mt-6 mx-auto"
        ref="dropdownRef"
      >
        <!-- Brand -->
        <!-- Brand -->
        <div
          class="text-center border-r border-gray-300 cursor-pointer relative w-[220px]"
          @click="toggleBrandDropdown"
        >
          <p class="text-sm font-semibold text-gray-800">Brand</p>
          <div class="flex overflow-x-auto gap-1 mt-1 max-w-full">
            <template v-if="selectedBrands.length">
              <span
                v-for="(brand, index) in selectedBrands"
                :key="brand.brandId"
                class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 flex-shrink-0"
              >
                {{ brand.name }}
                <button
                  @click.stop="removeBrand(index)"
                  class="itbms-brand-item-clear text-blue-500 hover:text-red-500 font-bold"
                >
                  x
                </button>
              </span>
            </template>
            <template v-else>
              <span class="text-gray-500 text-xs">Filter by brand(s)</span>
            </template>
          </div>

          <div
            v-if="showBrandDropdown"
            class="absolute mt-2 bg-white border text-black border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg z-50 w-64"
          >
            <div
              v-for="brand in brandOptions
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))"
              :key="brand.brandId"
              class="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
              @click.stop="toggleBrand(brand)"
            >
              <input
                type="checkbox"
                :checked="isBrandChecked(brand.brandId)"
                @change="toggleBrand(brand)"
              />
              <span>{{ brand.name }}</span>
            </div>
          </div>
        </div>

        <!-- Price -->
        <div
          class="flex-1 text-center border-r text-black border-gray-300 cursor-pointer relative"
          @click="togglePriceDropdown"
        >
          <p class="text-sm font-semibold text-gray-800">Price</p>
          <div class="flex justify-center mt-1">
            <template v-if="selectedPrice">
              <span
                class="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
              >
                {{
                  priceOptions.find(
                    (p) =>
                      p.min === selectedPrice.min && p.max === selectedPrice.max
                  )?.label
                }}
                <button
                  @click.stop="removePrice"
                  class="itbms-price-item-clear text-green-500 hover:text-red-500 font-bold"
                >
                  x
                </button>
              </span>
            </template>
            <template v-else>
              <span class="text-gray-500 text-xs">Price Range</span>
            </template>
          </div>
          <div
            v-if="showPriceDropdown"
            class="absolute mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-64"
          >
            <div
              v-for="option in priceOptions"
              :key="option.label"
              class="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
              @click.stop="selectPrice(option)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>

        <!-- Storage -->
        <div
          class="flex-1 text-center cursor-pointer relative"
          @click="showStorageDropdown = !showStorageDropdown"
        >
          <p class="text-sm font-semibold text-black">Storage Size</p>
          <div class="flex flex-wrap justify-center gap-1 mt-1">
            <template v-if="selectedStorage.length">
              <span
                v-for="(s, index) in selectedStorage"
                :key="s"
                class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
              >
                {{ formatStorage(s) }}
                <button
                  @click.stop="removeStorage(index)"
                  class="itbms-storage-size-item-clear text-purple-500 hover:text-red-500 font-bold"
                >
                  x
                </button>
              </span>
            </template>

            <template v-else>
              <span class="text-gray-500 text-xs">Storage Range</span>
            </template>
          </div>
          <div
            v-if="showStorageDropdown"
            class="absolute mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-64"
          >
            <div
              v-for="option in storageOptions"
              :key="option.value"
              class="px-4 py-2 text-black hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
              @click.stop="toggleStorage(option)"
            >
              <input
                type="checkbox"
                :checked="isStorageChecked(option.value)"
                @change="toggleStorage(option)"
              />
              <span>{{ option.label }}</span>
            </div>
          </div>
        </div>
        <!-- Clear -->
        <button
          @click="clearAll"
          class="itbms-brand-filter-clear ml-3 text-black bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex-shrink-0"
        >
          Clear
        </button>
      </div>

      <!-- Page size -->
      <div class="flex items-center gap-2 h-[42px] mt-2">
        <label for="pageSize" class="text-gray-700 text-sm cursor-pointer"
          >Show :</label
        >
        <select
          id="pageSize"
          v-model="pageSize"
          class="itbms-page-size border border-gray-300 px-3 h-full rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  </div>
</template>
