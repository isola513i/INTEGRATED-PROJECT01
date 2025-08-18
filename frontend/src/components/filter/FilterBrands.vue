<script setup>
import { ref, onMounted, watch } from "vue";
import { fetchBrands } from "@/services/brandService";

// Props เพิ่ม clearAllTrigger
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  clearAllTrigger: { type: Boolean, default: false },
});

// watch clearAllTrigger
watch(
  () => props.clearAllTrigger,
  (val) => {
    if (val) {
      selectedBrands.value = [];
    }
  }
);

// Emits สำหรับ v-model
const emit = defineEmits(["update:modelValue"]);

const selectedBrands = ref([]);
const brandOptions = ref([]);
const showBrandDropdown = ref(false);
const dropdownRef = ref(null);

// watch เพื่อ sync ค่าเมื่อ parent reset
watch(
  () => props.modelValue,
  (newVal) => {
    selectedBrands.value = [...newVal];
  }
);

// Toggle dropdown
function toggleBrandDropdown() {
  showBrandDropdown.value = !showBrandDropdown.value;
}

// ตรวจสอบว่าแบรนด์ถูกเลือกหรือไม่
function isBrandChecked(brand) {
  return selectedBrands.value.some((b) =>
    b.brandId !== null ? b.brandId === brand.brandId : b.name === brand.name
  );
}

function toggleBrand(brand) {
  const exists = selectedBrands.value.find((b) => b.brandId === brand.brandId);
  if (exists) {
    selectedBrands.value = selectedBrands.value.filter(
      (b) => b.brandId !== brand.brandId
    );
  } else {
    selectedBrands.value = [
      ...selectedBrands.value,
      { brandId: brand.brandId, name: brand.name },
    ];
  }

  // ส่งข้อมูล brand ที่เลือกไป parent component
  emit(
    "update:brands",
    selectedBrands.value.map((b) => b.name)
  );
}

// ลบแบรนด์ออก
function removeBrand(index) {
  selectedBrands.value.splice(index, 1);
  emit("update:modelValue", selectedBrands.value);
}

// ดึงข้อมูลแบรนด์เมื่อ mounted
onMounted(async () => {
  const stored = JSON.parse(sessionStorage.getItem("filterBrands") || "[]");

  selectedBrands.value = stored.map((b) =>
    typeof b === "string" ? { brandId: null, name: b } : b
  );

  const brands = await fetchBrands();
  brandOptions.value = brands.filter(
    (b) => b.name.toLowerCase() !== "filter by brand"
  );
});
</script>

<template>
  <div
    class="text-center border-r border-gray-300 cursor-pointer relative w-full max-w-[25%]"
    ref="dropdownRef"
    @click="toggleBrandDropdown"
  >
    <p class="text-sm font-semibold text-gray-800">Brand</p>

    <!-- แสดงแบรนด์ที่เลือก หรือ placeholder -->
    <div
      class="flex flex-nowrap overflow-x-auto gap-1 mt-1 max-w-full whitespace-nowrap items-center min-h-[28px]"
    >
      <template v-if="selectedBrands.length">
        <span
          v-for="(brand, index) in selectedBrands"
          :key="brand?.brandId"
          class="bg-blue-100 text-blue-800 px-2 py-0.5 justify-center rounded-full text-xs flex items-center gap-1 flex-shrink-0"
        >
          {{ brand?.name ?? brand }}
          <button
            @click.stop="removeBrand(index)"
            class="text-blue-500 hover:text-red-500 font-bold"
          >
            x
          </button>
        </span>
      </template>
      <template v-else>
        <span class="flex-1 text-center text-gray-500 text-xs">
          Filter by brand(s)
        </span>
      </template>
    </div>

    <!-- Dropdown แสดงแบรนด์ทั้งหมด -->
    <div
      v-if="showBrandDropdown"
      class="absolute mt-2 bg-white border text-black border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg z-50 w-full sm:w-64"
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
