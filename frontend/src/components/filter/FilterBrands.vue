<script setup>
import { ref, onMounted, watch } from "vue";
import { fetchBrands } from "@/services/brandService";

const emit = defineEmits(["update:brands"]);

const selectedBrands = ref([]);
const brandOptions = ref([]);
const showBrandDropdown = ref(false);

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

function removeBrand(index) {
  selectedBrands.value.splice(index, 1);
}

onMounted(async () => {
  const brands = await fetchBrands();
  brandOptions.value = brands.filter(
    (b) => b.name.toLowerCase() !== "filter by brand"
  );
});

watch(selectedBrands, () => {
  emit(
    "update:brands",
    selectedBrands.value.map((b) => b.name)
  );
});
</script>

<template>
  <div
    class="flex-1 text-center border-r border-gray-300 cursor-pointer relative"
    @click="showBrandDropdown = !showBrandDropdown"
  >
    <p class="text-sm font-semibold text-gray-800">Brand</p>
    <div class="flex flex-wrap justify-center gap-1 mt-1">
      <template v-if="selectedBrands.length">
        <span
          v-for="(brand, index) in selectedBrands"
          :key="brand.brandId"
          class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
        >
          {{ brand.name }}
          <button
            @click.stop="removeBrand(index)"
            class="text-blue-500 hover:text-red-500 font-bold"
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
      class="absolute mt-2 bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg z-50 w-64"
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
</template>
