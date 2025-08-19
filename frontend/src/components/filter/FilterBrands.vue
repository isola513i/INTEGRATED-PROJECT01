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

// ลบแบรนด์ออก
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
    class="text-center border-r border-gray-300 cursor-pointer relative w-full max-w-[25%]"
    ref="dropdownRef"
    @click="toggleBrandDropdown"
  >
    <p class="text-sm font-semibold text-gray-800">Brand</p>

    <!-- แสดงแบรนด์ที่เลือก -->
    <div
      class="flex flex-nowrap overflow-x-auto gap-1 mt-1 max-w-full whitespace-nowrap items-center min-h-[28px]"
    >
      <template v-if="selectedBrands.length">
        <span
          v-for="(brand, index) in selectedBrands"
          :key="brand?.brandId ?? brand.name"
          class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 flex-shrink-0"
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

    <!-- Dropdown -->
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
          :checked="isBrandChecked(brand)"
          @change="toggleBrand(brand)"
        />
        <span>{{ brand.name }}</span>
      </div>
    </div>
  </div>
</template>
