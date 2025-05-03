<script setup>
import { onMounted, ref, computed } from "vue";
import img1 from "@/assets/phone.jpg";
import img2 from "@/assets/phone.jpg";
import img3 from "@/assets/phone.jpg";
import img4 from "@/assets/phone.jpg";
import img5 from "@/assets/phone.jpg";
import { useRoute } from "vue-router";
import { fetchItembyId } from "@/services/saleItemService";

const route = useRoute();

const product = ref({});
onMounted(async() => {
  const data = await fetchItembyId(route.params.slug)
  product.value = data
});

const images = [img1, img2, img3, img4, img5];
const selectedIndex = ref(0);
const selectedImage = computed(() => images[selectedIndex.value]);

const prev = () => {
  selectedIndex.value =
    selectedIndex.value === 0 ? images.length - 1 : selectedIndex.value - 1;
};

const next = () => {
  selectedIndex.value =
    selectedIndex.value === images.length - 1 ? 0 : selectedIndex.value + 1;
};

const quantity = ref(1);

const increaseQty = () => {
  if (quantity.value < product.value.quantity) {
    quantity.value++;
  }
};
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};
const handleInput = () => {
  if (quantity.value > product.value.quantity) {
    quantity.value = product.value.quantity;
  } else if (quantity.value < 1) {
    quantity.value = 1;
  }
};

const formattedPrice = computed(
  () => product.value?.price?.toLocaleString() ?? "-",
);
const showFullDescription = ref(false);

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};

const shouldShowToggle = computed(() => {
  return product.value.description && product.value.description.length > 50;
});
</script>

<template>
  <div class="pt-[55px] bg-white">
    <div class="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      <!-- Main Image & Gallery -->
      <div>
        <!-- รูปภาพหลัก + ปุ่มเลื่อน -->
        <div
          class="relative bg-gray-100 rounded-xl flex justify-center items-center overflow-hidden h-[500px]"
        >
          <img :src="selectedImage" class="w-full h-full object-cover" />

          <!-- ปุ่มก่อนหน้า -->
          <button
            @click="prev"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black text-3xl focus:outline-none z-10"
            aria-label="Previous"
          >
            ‹
          </button>

          <!-- ปุ่มถัดไป -->
          <button
            @click="next"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black text-3xl focus:outline-none z-10"
            aria-label="Next"
          >
            ›
          </button>
        </div>

        <!-- Thumbnails -->
        <div class="flex space-x-2 mt-4 overflow-x-auto scrollbar-hide">
          <button
            v-for="(img, index) in images"
            :key="index"
            @click="selectedIndex = index"
            class="w-24 h-24 rounded-xl border overflow-hidden flex items-center justify-center"
            :class="{
              'border-gray-400': selectedIndex === index,
              'border-gray-200': selectedIndex !== index,
            }"
          >
            <img :src="img" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Product Details -->
      <div>
        <div class="itbms-brand text-sm text-gray-500 mb-2">{{ product.brandName  }}</div>
        <h1 class=" itbms-model text-3xl font-bold mb-2 text-black truncate">
          {{ product.model }}
        </h1>

        <div class="itbms-price text-2xl font-semibold text-gray-800 mb-1">
          <span class="itbms-price-unit">฿</span>
          <span class="itbms-price">{{ formattedPrice }}</span> 
        </div>

        <div class="mt-5">
          <h2 class="text-md font-semibold mb-2 text-black">Specification</h2>
          <div class="grid grid-cols-2 gap-4 max-w-md">
            <div
              class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100"
            >
              <div class="text-sm text-gray-500">Ram</div>
              <div class="font-medium text-gray-800 ">
              <span class="itbms-ramGb"> {{ product.ramGb ? product.ramGb : "-" }}</span> 
              <span class="itbms-ramGb-unit">   Gb</span>
              </div>
            </div>

            <div
              class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100"
            >
              <div class="text-sm text-gray-500">Screen Size</div>
              <div class="font-medium text-gray-800">
                <span class="itbms-screenSizeInch">{{product.screenSizeInch ? product.screenSizeInch : "-"}}</span>
                <span class="itbms-screenSizeInch-unit">  Inch</span>
              </div>
            </div>

            <div
              class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100"
            >
              <div class="text-sm text-gray-500">Storage</div>
              <div class="font-medium text-gray-800">
                {{ product.storageGb ? product.storageGb  : "-" }}
              </div>
            </div>

            <div
              class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100"
            >
              <div class="text-sm text-gray-500">Color</div>
              <div class="font-medium text-gray-800">

                <span class="itbms-storageGb">{{ product.color ? product.color : "-" }}</span>
                <span class="itbms-storageGb-unit" > Gb</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <div class="text-sm text-gray-500 mb-2">
            <span class="itbms-quantity">Avialable Quatity : {{ product.quantity }}</span> 
            <span class="itbms-quantity-unit"> units</span>
          </div>
        </div>
        <!-- Quantity Selector -->
        <div class="flex items-center space-x-4 mt-2">
          <span class="text-gray-700">Quantity</span>
          <button
            @click="decreaseQty"
            class="w-5 h-5 border rounded text-lg font-semibold text-gray-500 flex items-center justify-center"
          >
            -
          </button>
          <input
            type="number"
            v-model="quantity"
            min="1"
            :max="product.quantity"
            @input="handleInput"
            class="w-12 border text-center text-gray-500 rounded border-gray-500"
          />
          <button
            @click="increaseQty"
            class="w-5 h-5 border rounded text-lg font-semibold text-gray-500 flex items-center justify-center"
          >
            +
          </button>
        </div>

        <!-- Buttons -->
        <div class="flex space-x-4 mt-6">
          <button
            class="px-6 py-2 bg-[#4180d1] text-white rounded-md hover:bg-[#0E3971]"
          >
            Add to cart
          </button>
          <button
            class="px-6 py-2 bg-[#1D5298] text-white rounded-md hover:bg-[#0E3971]"
          >
            Buy now
          </button>
        </div>

        <div class="mt-5">
          <h2 class="text-md font-semibold mb-2 text-black">Description</h2>

          <div
            class="relative transition-all duration-300 ease-in-out overflow-hidden max-w-full"
            :class="
              showFullDescription
                ? 'max-h-[none]'
                : 'max-h-[60px] overflow-hidden'
            "
          >
            <p class="text-gray-700 whitespace-pre-line break-words">
              {{ product.description }}
            </p>
          </div>

          <button
            v-if="shouldShowToggle"
            @click="toggleDescription"
            class="mt-1 text-blue-400 hover:underline text-sm"
          >
            {{ showFullDescription ? "show less" : "read more" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
