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
    @click="togglePriceDropdown"
    class="flex-1 text-center border-r border-gray-300 w-full max-w-[25%] cursor-pointer relative"
  >
    <p class="text-sm font-semibold text-gray-800">Price</p>
    <div class="flex justify-center mt-1">
      <template v-if="selectedPrice.min !== null || selectedPrice.max !== null">
        <span
          class="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
        >
          {{
            priceOptions.find(
              (p) =>
                p.min === selectedPrice?.min && p.max === selectedPrice?.max
            )?.label || `${selectedPrice.min || 0} - ${selectedPrice.max || "∞"} Baht`
          }}
          <button
            @click.stop="removePrice"
            class="text-green-500 hover:text-red-500 font-bold"
          >
            x
          </button>
        </span>
      </template>
      <template v-else>
        <span class="text-gray-500 text-xs">Price Range</span>
      </template>
    </div>

    <!-- Dropdown -->
    <div
      v-if="showPriceDropdown"
      class="absolute mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-64 p-2 space-y-2"
      @click.stop
    >
      <!-- ปุ่ม option เดิม -->
      <div
        v-for="option in priceOptions"
        :key="option.label"
        class="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
        @click="selectedPrice = { min: option.min, max: option.max }; updateCustomPrice()"
      >
        {{ option.label }}
      </div>

      <hr class="border-gray-300 my-2">

      <!-- ช่องใส่ min/max -->
      <div class="flex gap-2 text-black">
        <input
          type="number"
          v-model.number="selectedPrice.min"
          placeholder="Min"
          class="border rounded px-2 py-1 w-1/2"
          @input="updateCustomPrice"
        />
        <input
          type="number"
          v-model.number="selectedPrice.max"
          placeholder="Max"
          class="border rounded px-2 py-1 w-1/2"
          @input="updateCustomPrice"
        />
      </div>
    </div>
  </div>
</template>
