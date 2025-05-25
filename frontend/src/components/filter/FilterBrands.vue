<script setup>
import { ref, onMounted, watch } from "vue";
import { fetchBrands } from "@/services/brandService";

const emit = defineEmits(["update:brands", "update:pageSize"]);

const selectedBrand = ref("");
const selectedBrands = ref([]);
const brandOptions = ref([]);
const pageSize = ref(10);
onMounted(async () => {
  const brands = await fetchBrands();
  brandOptions.value = brands.filter(
    (b) => b.name.toLowerCase() !== "filter by brand",
  );
});
watch(pageSize, (newVal) => {
  emit("update:pageSize", Number(newVal));
});
function addBrand() {
  const brandId = selectedBrand.value;
  const brand = brandOptions.value.find((b) => b.brandId === brandId);
  if (brand && !selectedBrands.value.some((b) => b.brandId === brandId)) {
    selectedBrands.value.push({ brandId: brand.brandId, name: brand.name });
    emit("update:brands", selectedBrands.value.map((b) => b.name)); // ส่งเฉพาะชื่อ
  }
  selectedBrand.value = "";
}


function removeBrand(index) {
  selectedBrands.value.splice(index, 1);
  emit("update:brands", selectedBrands.value.map((b) => b.name)); // ส่งเฉพาะชื่อ
}


function clearAll() {
  selectedBrands.value = [];
  selectedBrand.value = "";
  emit("update:brands", []);
}


function getBrandName(id) {
  const found = brandOptions.value.find((b) => b.brandId === id);
  return found ? found.name : id;
}
</script>

<template>
  <div class="space-y-4">
    <!-- กลุ่ม Filter + Add + Clear + Page size -->
    <div class="flex flex-wrap gap-4 items-center">
      <!-- Filter + Add + Clear -->
      <div
        class="flex items-center w-full md:w-auto border border-gray-300 rounded-lg overflow-hidden"
      >
        <select
          v-model="selectedBrand"
          class="flex-grow px-4 h-[42px] text-gray-700 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled selected hidden>Filter by brand(s)</option>
          <option
            v-for="brand in brandOptions"
            :key="brand.brandId"
            :value="brand.brandId"
            class="itbms-brand-filter"
          >
            {{ brand.name }}
          </option>
        </select>

        <button
          @click="addBrand"
          class="itbms-brand-filter-button bg-gray-800 hover:bg-blue-600 text-white px-4 h-[42px] text-sm font-medium"
        >
          +
        </button>

        <button
          @click="clearAll"
          class="itbms-brand-filter-clear bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 h-[42px] text-sm font-medium"
        >
          Clear
        </button>
      </div>

      <!-- Page size -->
      <div class="flex items-center gap-2 h-[42px]">
        <label for="pageSize" class="text-gray-700 text-sm">Page size:</label>
        <select
          id="pageSize"
          v-model="pageSize"
          class="itbms-page-size border border-gray-300 px-3 h-full rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>

    <!-- Selected brands -->
    <div class="flex flex-wrap gap-2 max-w-full">
      <div
        v-for="(brand, index) in selectedBrands"
        :key="brand.id"
        class="flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm shadow-sm"
      >
        <span class="itbms-filter-item truncate max-w-[150px]">{{ brand.name }}</span>
        <button
          @click="removeBrand(index)"
          class="itbms-filter-item-clear ml-2 text-blue-500 hover:text-red-500 font-bold"
          title="Remove"
        >
          &times;
        </button>
      </div>
    </div>
  </div>
</template>

