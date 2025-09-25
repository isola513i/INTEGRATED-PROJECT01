<script setup>
import { ref, onMounted, watch } from "vue";
import { fetchBrands } from "@/services/brandService";

// Props
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  clearAllTrigger: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits(["update:modelValue", "update:brands"]);

const selectedBrands = ref([]);
const brandOptions = ref([]);
const showBrandDropdown = ref(false);
const dropdownRef = ref(null);

// watch clearAllTrigger → reset ค่า
watch(
  () => props.clearAllTrigger,
  (val) => {
    if (val) {
      selectedBrands.value = [];
      sessionStorage.removeItem("filterBrands");
      emit("update:modelValue", []);
      emit("update:brands", []);
    }
  }
);

// sync ค่า modelValue จาก parent
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

// ตรวจสอบว่าแบรนด์ถูกเลือกหรือยัง
function isBrandChecked(brand) {
  return selectedBrands.value.some(
    (b) => b.brandId === brand.brandId || b.name === brand.name
  );
}

// เลือก/ยกเลิกเลือก brand
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

  // update ค่าไป parent
  emit("update:modelValue", selectedBrands.value);
  emit(
    "update:brands",
    selectedBrands.value.map((b) => b.name)
  );

  // เก็บลง sessionStorage
  sessionStorage.setItem("filterBrands", JSON.stringify(selectedBrands.value));
}

function removeBrand(index) {
  selectedBrands.value.splice(index, 1);

  emit("update:modelValue", selectedBrands.value);
  emit(
    "update:brands",
    selectedBrands.value.map((b) => b.name)
  );

  // อัปเดต sessionStorage
  sessionStorage.setItem("filterBrands", JSON.stringify(selectedBrands.value));
}

// โหลดข้อมูลแบรนด์ตอน mounted
onMounted(async () => {
  // โหลดค่าที่เคยเลือกจาก sessionStorage
  const stored = JSON.parse(sessionStorage.getItem("filterBrands") || "[]");
  selectedBrands.value = stored.map((b) =>
    typeof b === "string" ? { brandId: null, name: b } : b
  );

  // ส่งค่าไป parent ด้วย (กัน parent ไม่รู้ state)
  emit("update:modelValue", selectedBrands.value);
  emit(
    "update:brands",
    selectedBrands.value.map((b) => b.name)
  );

  // โหลด brand options จาก API
  const brands = await fetchBrands();
  brandOptions.value = brands.filter(
    (b) => b.name.toLowerCase() !== "filter by brand"
  );
});
</script>

<template>
  <div
    ref="dropdownRef"
    class="relative w-full text-center cursor-pointer"
    @click="toggleBrandDropdown"
  >
    <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Brand</p>

    <!-- Selected chips -->
    <div class="flex flex-nowrap overflow-x-auto gap-1 mt-1 max-w-full whitespace-nowrap items-center justify-center min-h-[28px]">
      <template v-if="selectedBrands.length">
        <span
          v-for="(brand, index) in selectedBrands"
          :key="brand?.brandId ?? brand.name"
          class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 flex-shrink-0 border border-slate-200"
        >
          {{ brand?.name ?? brand }}
          <button
            @click.stop="removeBrand(index)"
            class="text-slate-500 hover:text-red-500 font-bold leading-none"
            aria-label="Remove brand"
          >
            ×
          </button>
        </span>
      </template>
      <template v-else>
        <span class="text-gray-500 text-xs">Filter by brand(s)</span>
      </template>
    </div>

    <!-- Dropdown -->
    <div
      v-if="showBrandDropdown"
      class="absolute mt-2 bg-white text-black border border-gray-300 rounded-lg shadow-lg z-50 w-full sm:w-64 max-h-60 overflow-auto p-1"
      @click.stop
    >
      <div
        v-for="brand in brandOptions.slice().sort((a, b) => a.name.localeCompare(b.name))"
        :key="brand.brandId"
        class="px-3 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer rounded"
        @click="toggleBrand(brand)"
      >
        <input
          type="checkbox"
          :checked="isBrandChecked(brand)"
          @change.stop="toggleBrand(brand)"
        />
        <span class="text-sm">{{ brand.name }}</span>
      </div>
    </div>
  </div>
</template>
