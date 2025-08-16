<!-- <script setup>
import { ref, watch, onMounted } from "vue";

const emit = defineEmits(["update:price"]);

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

function selectPrice(option) {
  selectedPrice.value = { min: option.min, max: option.max };
  showPriceDropdown.value = false;
}
function removePrice() {
  selectedPrice.value = null;
}

onMounted(() => {
  const savedPrice = JSON.parse(sessionStorage.getItem("selectedPrice"));
  if (savedPrice) selectedPrice.value = savedPrice;
});

watch(selectedPrice, (newVal) => {
  emit("update:price", newVal);
  if (newVal) sessionStorage.setItem("selectedPrice", JSON.stringify(newVal));
  else sessionStorage.removeItem("selectedPrice");
});
</script>

<template>
  <div
    class="flex-1 text-center border-r text-black border-gray-300 cursor-pointer relative"
    @click="showPriceDropdown = !showPriceDropdown"
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
</template> -->
