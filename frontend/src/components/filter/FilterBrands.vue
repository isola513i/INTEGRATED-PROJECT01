<script setup>
import { ref, onMounted, watch } from "vue";
import { fetchBrands } from "@/services/brandService";

const emit = defineEmits(["update:brands", "update:pageSize"]);

const selectedBrands = ref([]);
const brandOptions = ref([]);
const pageSize = ref(parseInt(sessionStorage.getItem("pageSize")) || 10);
const showDropdown = ref(false);

const filteredBrands = JSON.parse(
  sessionStorage.getItem("filterBrands") || "[]",
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
    (b) => b.name.toLowerCase() !== "filter by brand",
  );
});
import { onBeforeUnmount } from "vue";

// สร้าง ref ไปผูกกับ container
const dropdownRef = ref(null);

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false;
  }
}
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});


watch(pageSize, (newVal) => {
  emit("update:pageSize", Number(newVal));
});

watch(selectedBrands, () => {
  emit(
    "update:brands",
    selectedBrands.value.map((b) => b.name),
  );
});

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function isChecked(brandId) {
  return selectedBrands.value.some((b) => b.brandId === brandId);
}

function toggleBrand(brand) {
  const exists = selectedBrands.value.find((b) => b.brandId === brand.brandId);
  if (exists) {
    selectedBrands.value = selectedBrands.value.filter(
      (b) => b.brandId !== brand.brandId,
    );
  } else {
    selectedBrands.value = [
      ...selectedBrands.value,
      { brandId: brand.brandId, name: brand.name },
    ];
  }
  emit(
    "update:brands",
    selectedBrands.value.map((b) => b.name),
  );
}

function removeBrand(index) {
  selectedBrands.value.splice(index, 1);
  emit(
    "update:brands",
    selectedBrands.value.map((b) => b.name),
  );
}
function clearAll() {
  selectedBrands.value = [];
}
</script>

<template>
  <div class="space-y-4 itbms-brand-filter">
    <div class="flex flex-wrap gap-2 max-w-full">
      <div
        v-for="(brand, index) in selectedBrands"
        :key="brand.name"
        class="flex itbms-brand-filter-item justify-between items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm shadow-sm max-w-[200px] min-w-0"
      >
        <span
          class="truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
        >
          {{ brand.name }}
        </span>

        <button
          @click="removeBrand(index)"
          class="itbms-filter-item-clear ml-2 text-blue-500 hover:text-red-500 font-bold flex-shrink-0"
          title="Remove"
        >
          x
        </button>
      </div>
    </div>
    <div class="flex flex-wrap gap-4 items-center">
      <!-- Custom dropdown -->
      <div class="relative w-full md:w-auto"
      ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="w-full md:w-[250px] text-left px-4 h-[42px] bg-white border border-gray-300 rounded-lg text-gray-700 text-base focus:outline-none cursor-pointer"
        >
          Filter by brand(s)
        </button>

        <div
          v-if="showDropdown"
          class="absolute mt-1 w-full z-50 bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg"

          >
          <div
            v-for="brand in brandOptions
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))"
            :key="brand.brandId"
            class="itbms-filter-item px-4 py-2 text-black hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            @click="toggleBrand(brand)"

          >
            <input
              type="checkbox"
              :checked="isChecked(brand.brandId)"
              @change="toggleBrand(brand)"
            />
            <span>{{ brand.name }}</span>
          </div>
        </div>
        <button
          @click="toggleDropdown"
          class="itbms-brand-filter-button p-2 pt-3 text-gray-700"
          
        >
        <img
        src="@/assets/images/filter/filterButton.png"
        alt="Filter"
        class="h-5 w-5"
      /></button>
      </div>

      <!-- Clear -->
      <button
        @click="clearAll"
        class="itbms-brand-filter-clear block text-center px-6 py-2 bg-[#171717] text-white rounded hover:bg-white hover:text-black hover:border hover:border-[#171717] transition-all duration-300 text-sm font-semibold cursor-pointer"
      >
        Clear
      </button>

      <!-- Page size -->
      <div class="flex items-center gap-2 h-[42px]">
        <label for="pageSize" class="text-gray-700 text-sm cursor-pointer"
          >Page size:</label
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
