<script setup>
/* --- Imports --- */
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchItemById, deleteItemById } from "@/services/saleItemService";
import phoneImg from "@/assets/phone.jpg";

/* --- Routing & State --- */
const route = useRoute();
const router = useRouter();
const product = ref({});
const quantity = ref(1);
const showModal = ref(false);
const showFullDescription = ref(false);
const successMessage = ref("");

/* --- Fetch Product on Mount --- */
onMounted(async () => {
  if (route.query.successMessage) {
    successMessage.value = String(route.query.successMessage);
    setTimeout(() => {
      successMessage.value = "";
    }, 4000);
    router.replace({ query: {} });
  }
  try {
    const data = await fetchItemById(route.params.slug);
    if (!data) throw new Error("Not found");
    product.value = data;
  } catch {
    window.alert("The requested sale item does not exist.");
    router.push("/sale-items");
  }
});

/* --- Image Gallery --- */
const images = [phoneImg, phoneImg, phoneImg, phoneImg, phoneImg];
const selectedIndex = ref(0);
const selectedImage = computed(() => images[selectedIndex.value]);

const prev = () => {
  selectedIndex.value = selectedIndex.value === 0
    ? images.length - 1
    : selectedIndex.value - 1;
};
const next = () => {
  selectedIndex.value = selectedIndex.value === images.length - 1
    ? 0
    : selectedIndex.value + 1;
};

/* --- Quantity Logic --- */
const increaseQty = () => {
  if (quantity.value < product.value.quantity) quantity.value++;
};
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};
const handleInput = () => {
  quantity.value = Math.min(Math.max(1, quantity.value), product.value.quantity);
};

/* --- Description Toggle --- */
const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};
const shouldShowToggle = computed(() => product.value.description?.length > 50);

/* --- Delete Logic --- */
const deleteItem = async () => {
  try {
    await deleteItemById(route.params.slug); // ถ้าได้ 204 ตรงนี้จะสำเร็จ
    router.push({
        path: `/sale-items`,
        query: {
          successMessage: "The sale item has been deleted.",
        },
      });
  } catch (error) {
    
    if (error.response?.status === 404) {
      window.alert("The requested sale item does not exist.")
    } else {
      window.alert("Failed to delete the item.")
    }
    router.push("/sale-items")
  }
}

</script>

<template>
  <div class="pt-[55px] bg-white">
    <div
      v-if="successMessage"
      class="m-4 p-4 bg-green-100 text-green-800 shadow itbms-message"
    >
      ✅ {{ successMessage }}
    </div>
    <div class="mb-8 flex items-center gap-2">
      <router-link
        to="/sale-items"
        class="itbms-home-button text-gray-600 hover:text-black text-xl font-light"
        >Home
		</router-link
   
    <div v-if="product" class="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      
      <!-- Image Gallery -->
      <div>
        <div class="relative bg-gray-100 rounded-xl flex justify-center items-center overflow-hidden h-[500px]">
          <img :src="selectedImage" alt="Product image" class="w-full h-full object-cover" />
          <button @click="prev" class="absolute left-4 top-1/2 -translate-y-1/2 text-3xl z-10 text-gray-700 hover:text-black" aria-label="Previous">‹</button>
          <button @click="next" class="absolute right-4 top-1/2 -translate-y-1/2 text-3xl z-10 text-gray-700 hover:text-black" aria-label="Next">›</button>
        </div>

        <div class="flex space-x-2 mt-4 overflow-x-auto scrollbar-hide">
          <button
            v-for="(img, index) in images"
            :key="index"
            @click="selectedIndex = index"
            class="w-24 h-24 rounded-xl border flex items-center justify-center overflow-hidden"
            :class="selectedIndex === index ? 'border-gray-400' : 'border-gray-200'"
          >
            <img :src="img" alt="Thumbnail" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Product Details -->
      <div>
        <div class="itbms-brand text-sm itbms-brand text-gray-500 mb-2">{{ product.brandName }}</div>
        <h1 class="itbms-model text-3xl font-bold text-black truncate mb-2">{{ product.model }}</h1>

        <div class="text-2xl font-semibold text-gray-800 mb-4">
          <span class="itbms-price-unit">Baht </span>
          <span class="itbms-price">{{ product.price?.toLocaleString() }}</span>
        </div>

        <!-- Specs -->
        <h2 class="text-md font-semibold mb-2 text-black">Specification</h2>
        <div class="grid grid-cols-2 gap-4 max-w-md">
          <div class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100">
            <div class="text-sm text-gray-500">RAM</div>
            <span class="itbms-ramGb text-gray-800 font-medium">{{ product.ramGb || "-" }}</span>
            <span class="itbms-ramGb-unit text-gray-800"> GB</span>
          </div>
          <div class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100">
            <div class="text-sm text-gray-500">Screen Size</div>
            <span class="itbms-screenSizeInch text-gray-800 font-medium">{{ product.screenSizeInch || "-" }}</span>
            <span class="itbms-screenSizeInch-unit text-gray-800"> Inch</span>
          </div>
          <div class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100">
            <div class="text-sm text-gray-500">Storage</div>
            <span class="itbms-storageGb text-gray-800 font-medium">{{ product.storageGb || "-" }}</span>
            <span class="itbms-storageGb-unit text-gray-800"> GB</span>
          </div>
          <div class="border rounded-xl p-3 text-center border-gray-400 hover:bg-gray-100">
            <div class="text-sm text-gray-500">Color</div>
            <div class="itbms-color text-gray-800 font-medium">{{ product.color || "-" }}</div>
          </div>
        </div>

        <!-- Quantity -->
        <div class="mt-5 text-sm text-gray-500">
          Available Quantity: <span class="itbms-quantity">{{ product.quantity }}></span><span class="itbms-quantity-unit">units</span> 
        </div>
        <div class="flex items-center space-x-4 mt-2">
          <span class=" text-gray-700">Quantity</span>
          <button @click="decreaseQty" class="w-5 h-5 border rounded flex items-center justify-center text-gray-500">-</button>
          <input
            type="number"
            v-model="quantity"
            @input="handleInput"
            :min="1"
            :max="product.quantity"
            class="w-12 border text-center rounded text-gray-500 border-gray-500"
          />
          <button @click="increaseQty" class="w-5 h-5 border rounded flex items-center justify-center text-gray-500">+</button>
        </div>

        <!-- Buttons -->
        <div class="flex space-x-4 mt-6">
          <router-link
            :to="`/sale-items/edit/${route.params.slug}`"
            class="itbms-edit-button px-6 py-2 bg-[#4180d1] text-white rounded-md hover:bg-[#0E3971]"
          >
            Edit
          </router-link>
          <button
            class="itbms-delete-button px-6 py-2 bg-[#1D5298] text-white rounded-md hover:bg-[#0E3971]"
            @click="showModal = true"
          >
            Delete
          </button>
        </div>

        <!-- Description -->
        <div class="mt-5">
          <h2 class="text-md font-semibold mb-2 text-black">Description</h2>
          <div
            class="relative transition-all duration-300 overflow-hidden max-w-full"
            :class="showFullDescription ? '' : 'max-h-[60px] overflow-hidden'"
          >
            <p class="itbms-description text-gray-700 whitespace-pre-line break-words">{{ product.description }}</p>
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

    <!-- Delete Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-[#ffffff8f] bg-opacity-50 flex items-center justify-center z-50">
      <div class="itbms-message bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 ">Delete Confirmation</h2>
        <p class="mb-6 text-gray-800 ">Do you want to delete this sale item?</p>
        <div class="flex justify-end space-x-4">
          <button @click="showModal = false" class="itbms-cancel-button bg-[#cc3535] px-4 py-2 rounded hover:bg-[#6d3e3e]">Cancel</button>
          <button @click="deleteItem" class="itbms-confirm-button bg-[#5eb238] text-white px-4 py-2 rounded hover:bg-[#58914c]">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>
