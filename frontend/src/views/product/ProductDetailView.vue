<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";
import {
  fetchItemById,
  deleteItemById,
  getItem,
} from "@/services/saleItemService";
import { useFlashStore } from "@/store/useFlashStore";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useCartStore } from "@/store/useCartStore";
const images = ref([]);
const selectedIndex = ref(0);
const auth = useAuthStore();
const product = ref({});
const quantity = ref(1);
const showModal = ref(false);
const showFullDescription = ref(false);
const successMessage = ref("");
const successMessageStyle = ref("");
const flash = useFlashStore();
const cart = useCartStore();
const route = useRoute();
const router = useRouter(); 
const onAdd = () => {
  if (!auth.isLoggedIn) {
    router.push("/signin");
    return;
  }
  const stock = Number(product.value.quantity || 0);
  const want = Number(quantity.value || 1);
  const qty = Math.min(Math.max(1, want), stock);

  cart.add(product.value, qty);
  flash.setMessage(
    "Added to cart",
    "fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-lg bg-green-500 text-white text-sm shadow-lg"
  );
};

const mainImage = computed(() => {
  return (
    images.value[selectedIndex.value] ||
    product.value.thumbnailUrl ||
    product.value.imageUrl ||
    ""
  );
});

onMounted(async () => {
  if (route.query.successMessage) {
    successMessage.value = String(route.query.successMessage);
    successMessageStyle.value = String(route.query.successMessageStyle);
    setTimeout(() => {
      successMessage.value = "";
      successMessageStyle.value = "";
    }, 4000);
    router.replace({ query: {} });
  }

  try {
    const data = await getItem(`v2/sale-items/${route.params.id}`);
    if (!data) throw new Error("Not found");
    product.value = data;

    // Load images
    const imagePromises = product.value.saleItemImages.map(async (image) => {
      const res = await fetch(
        `${API_BASE_URL}/v2/sale-items/${route.params.id}/images/${image.fileName}`
      );

      if (!res.ok) return null;

      return res.url;
    });
    const results = await Promise.all(imagePromises);
    images.value = results.filter(Boolean);
  } catch (err) {
    console.log("error :", err);
    router.push("/sale-items");
  }
});

const handleSelectedIndex = (index) => {
  selectedIndex.value = index;
};

const prev = () => {
  const len = images.value.length;
  if (len <= 1) return;
  selectedIndex.value =
    selectedIndex.value === 0 ? len - 1 : selectedIndex.value - 1;
};
const next = () => {
  const len = images.value.length;
  if (len <= 1) return;
  selectedIndex.value =
    selectedIndex.value === len - 1 ? 0 : selectedIndex.value + 1;
};

const increaseQty = () => {
  if (quantity.value < product.value.quantity) quantity.value++;
};
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};
const handleInput = () => {
  quantity.value = Math.min(
    Math.max(1, quantity.value),
    product.value.quantity
  );
};

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};
const shouldShowToggle = computed(() => product.value.description?.length > 50);

const deleteItem = async () => {
  try {
    await deleteItemById(route.params.id);
    flash.setMessage(
      "✅ The sale item has been deleted.",
      "m-4 p-4 bg-green-100 text-green-800 shadow itbms-message"
    );
    router.back();
  } catch (error) {
    flash.setMessage(
      "❌ The requested sale item does not exist.",
      "m-4 p-4 bg-red-100 text-red-800 shadow itbms-message"
    );
    router.back();
  }
};
</script>

<template>
  <div class="pt-[20px] bg-white">
    <div v-if="flash.message" :class="flash.style">
      {{ flash.message }}
    </div>

    <div aria-label="Breadcrumb" class="px-20 mb-6 text-sm text-gray-500">
      <ol class="flex items-center flex-wrap gap-1">
        <!-- Home link -->
        <li class="flex items-center">
          <router-link
            to="/"
            class="text-gray-500 hover:text-black font-medium transition-colors"
          >
            Home
          </router-link>
        </li>

        <!-- separator -->
        <li class="text-gray-400 px-1">/</li>
        <li class="flex items-center">
          <router-link
            to="/sale-items"
            class="text-gray-500 hover:text-black font-medium transition-colors"
          >
            Sale Item
          </router-link>
        </li>
        <li class="text-gray-400 px-1">/</li>
        <!-- Current product -->
        <li
          class="flex items-center text-gray-900 font-semibold truncate max-w-[60vw] md:max-w-[30vw]"
        >
          {{ product.model || "Loading..." }}
        </li>
      </ol>
    </div>

    <div
      v-if="product"
      class="itbms-row max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10"
    >
      <div>
        <div
          class="relative bg-gray-100 rounded-xl flex justify-center items-center overflow-hidden h-[500px]"
        >
          <img
            :src="mainImage"
            alt="Product image"
            class="w-full h-full object-cover"
          />
          <button
            v-if="images.length > 1"
            @click="prev"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-3xl z-10 text-gray-700 hover:text-black"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            v-if="images.length > 1"
            @click="next"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-3xl z-10 text-gray-700 hover:text-black"
            aria-label="Next"
          >
            ›
          </button>
        </div>

        <div class="flex space-x-2 mt-4 overflow-x-auto scrollbar-hide">
          <button
            v-for="(img, index) in images"
            :key="index"
            @click="selectedIndex = index"
            class="w-24 h-24 rounded-xl border flex items-center justify-center overflow-hidden"
            :class="
              selectedIndex === index ? 'border-gray-400' : 'border-gray-200'
            "
          >
            <img
              @click="handleSelectedIndex(index)"
              :src="img"
              alt="Thumbnail"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      <div>
        <div class="itbms-brand text-sm itbms-brand text-gray-500 mb-2">
          {{ product.brandName }}
        </div>
        <h1 class="itbms-model text-3xl font-bold text-black truncate mb-2">
          {{ product.model }}
        </h1>

        <div class="text-2xl font-semibold text-gray-800 mb-4">
          <span class="itbms-price-unit">Baht </span>
          <span class="itbms-price">{{ product.price?.toLocaleString() }}</span>
        </div>

        <h2 class="text-md font-semibold mb-2 text-black">Specification</h2>
        <div class="grid grid-cols-2 gap-4 max-w-md">
          <div
            class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100"
          >
            <div class="text-sm text-gray-500">RAM</div>
            <span class="itbms-ramGb text-gray-800 font-medium">{{
              product.ramGb || "-"
            }}</span>
            <span class="itbms-ramGb-unit text-gray-800"> GB</span>
          </div>
          <div
            class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100"
          >
            <div class="text-sm text-gray-500">Screen Size</div>
            <span class="itbms-screenSizeInch text-gray-800 font-medium">{{
              product.screenSizeInch || "-"
            }}</span>
            <span class="itbms-screenSizeInch-unit text-gray-800"> Inch</span>
          </div>
          <div
            class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100"
          >
            <div class="text-sm text-gray-500">Storage</div>
            <span class="itbms-storageGb text-gray-800 font-medium">{{
              product.storageGb || "-"
            }}</span>
            <span class="itbms-storageGb-unit text-gray-800"> GB</span>
          </div>
          <div
            class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100"
          >
            <div class="text-sm text-gray-500">Color</div>
            <div class="itbms-color text-gray-800 font-medium">
              {{ product.color || "-" }}
            </div>
          </div>
        </div>

        <div class="mt-5 text-sm text-gray-500">
          Available Quantity:
          <span class="itbms-quantity">{{ product.quantity }}</span
          ><span class="itbms-quantity-unit"> units</span>
        </div>
        <div class="flex items-center space-x-3 mt-4">
          <span class="text-black font-medium">Quantity</span>

          <!-- ปุ่มลด -->
          <button
            @click="decreaseQty"
            class="itbms-dec-qty-button w-8 h-8 border rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
          >
            -
          </button>

          <!-- input -->
          <input
            type="number"
            v-model.number="quantity"
            @input="handleInput"
            :min="1"
            :max="product.quantity"
            class="itbms-add-to-cart-quantity w-14 border text-center rounded-lg text-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <!-- ปุ่มเพิ่ม -->
          <button
            @click="increaseQty"
            class="itbms-inc-qty-button w-8 h-8 border rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
          >
            +
          </button>

          <!-- ปุ่ม Add to Cart -->
          <button
            @click="onAdd"
            class="itbms-add-to-cart-button ml-3 flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg border border-gray-300 hover:bg-gray-400 hover:text-white transition duration-200"
          >
            Add to Cart
          </button>
        </div>

        <div class="mt-5">
          <h2 class="text-md font-semibold mb-2 text-black">Description</h2>
          <div
            class="relative transition-all duration-300 overflow-hidden max-w-full"
            :class="showFullDescription ? '' : 'max-h-[60px] overflow-hidden'"
          >
            <p
              class="itbms-description text-gray-700 whitespace-pre-line break-words"
            >
              {{ product.description }}
            </p>
          </div>
          <button
            v-if="shouldShowToggle"
            @click="toggleDescription"
            class="mt-1 text-blue-400 hover:underline text-sm cursor-pointer"
          >
            {{ showFullDescription ? "show less" : "read more" }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-[#ffffff8f] bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="itbms-message bg-white rounded-lg p-6 shadow-lg max-w-sm w-full"
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-800">
          Delete Confirmation
        </h2>
        <p class="mb-6 text-gray-800">Do you want to delete this sale item?</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="deleteItem"
            class="itbms-confirm-button bg-[#5eb238] text-white px-4 py-2 rounded hover:bg-[#58914c] cursor-pointer"
          >
            Confirm
          </button>
          <button
            @click="showModal = false"
            class="itbms-cancel-button bg-[#cc3535] px-4 py-2 rounded hover:bg-[#6d3e3e] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
