<script setup>
import { onMounted, ref } from "vue";
import img1 from "@/assets/phone.jpg";
import img2 from "@/assets/phone.jpg";
import img3 from "@/assets/phone.jpg";
import products from "@/mocks/sale-items.json";
import { useRoute } from "vue-router";

const route = useRoute();

const product = ref({});

onMounted(() => {
  product.value = products.find((p) => p.saleItemId == route.params.slug);
});

const images = [img1, img2, img3];
const selectedImage = ref(images[0]);
const quantity = ref(1);

const increaseQty = () => {
  quantity.value++;
};

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};
</script>

<template>
  <div class="pt-[55px] bg-white">
    <div class="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      <!-- Main Image & Gallery -->
      <div>
        <div
          class="bg-gray-100 rounded-xl flex justify-center items-center overflow-hidden h-[500px]"
        >
          <img :src="selectedImage" class="w-full h-full object-cover" />
        </div>

        <!-- Thumbnails -->
        <div class="flex space-x-4 mt-4 overflow-x-auto scrollbar-hide">
          <button
            v-for="(img, index) in images"
            :key="index"
            @click="selectedImage = img"
            class="w-24 h-24 rounded-xl border overflow-hidden flex items-center justify-center"
            :class="{
              'border-gray-400': selectedImage === img,
              'border-gray-200': selectedImage !== img,
            }"
          >
            <img :src="img" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Product Details -->
      <div>
        <div class="text-sm text-gray-500 mb-2">{{ product.brandName }}</div>
        <h1 class="text-3xl font-bold mb-2 text-black">{{ product.model }}</h1>
        <div class="text-2xl font-semibold text-gray-800 mb-1">
          {{ product.price }}
        </div>
        <div class="text-sm text-gray-600 mb-4">
          Available quantity : {{ product.quantity }} unit
        </div>

        <div class="mb-6">
          <h2 class="text-md font-semibold mb-1 text-black">Description</h2>
          <p class="text-gray-700">
            {{ product.desscription }}
          </p>
        </div>

        <div>
          <h2 class="text-md font-semibold mb-2 text-black">Specification</h2>
          <div class="grid grid-cols-2 gap-4">
            <div
              class="border rounded-xl p-4 text-center border-gray-400 hover:bg-gray-100"
            >
              <div class="text-sm text-gray-500">Ram</div>
              <div class="font-medium text-gray-800">{{ product.ramGB }}</div>
            </div>
            <div
              class="border rounded-xl p-4 text-center border-gray-400 hover:bg-gray-100"
            >
              <div class="text-sm text-gray-500">Screen Size</div>
              <div class="font-medium text-gray-800">
                {{ product.screenSizeInch }}
              </div>
            </div>
            <div
              class="border rounded-xl p-4 text-center border-gray-400 hover:bg-gray-100"
            >
              <div class="text-sm text-gray-500">Storage</div>
              <div class="font-medium text-gray-800">
                {{ product.storageGB }}
              </div>
            </div>
            <div
              class="border rounded-xl p-4 text-center border-gray-400 hover:bg-gray-100"
            >
              <div class="text-sm text-gray-500">Color</div>
              <div class="font-medium text-gray-800">{{ product.color }}</div>
            </div>
          </div>
        </div>

        <!-- Quantity Selector -->
        <div class="flex items-center space-x-4 mt-6">
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
            class="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Add to cart
          </button>
          <button
            class="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
