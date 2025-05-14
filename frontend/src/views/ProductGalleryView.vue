<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { fetchSaleItems } from "@/services/saleItemService";
import SaleItemCard from "@/components/ProductGallery/SaleItemCard.vue";
import ProductFilter from "@/components/ProductGallery/ProductFilter.vue";
import ProductCarousel from "@/components/ProductGallery/ProductCarousel.vue";
import PromoBar from "@/components/ProductGallery/PromoBar.vue";

const saleItems = ref([]);
const loading = ref(true);
const router = useRouter();
const route = useRoute();
const successMessage = ref("");

onMounted(async () => {
  if (route.query.successMessage) {
    successMessage.value = String(route.query.successMessage);
    setTimeout(() => {
      successMessage.value = "";
    }, 4000);
    router.replace({ query: {} });
  }

  try {
    const data = await fetchSaleItems();
    saleItems.value = Array.isArray(data) ? data : [];
  } catch (err) {
    router.push("/server-error");
  } finally {
    loading.value = false;
  }
});

const productCount = computed(() => saleItems.value.length);
</script>

<template>
  <div class="min-h-screen bg-white">
    <PromoBar />
    <ProductCarousel />
    <!-- Add button -->
    <div class="itbms-sale-item-add flex justify-center my-6">
      <router-link
        to="/sale-items/add"
        class="px-6 py-2 bg-[#171717] text-white rounded-2xl hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 text-sm font-semibold"
      >
        Add New Sale Item
      </router-link>
    </div>

    <ProductFilter :productCount="productCount" />
    
    <div
      v-if="successMessage"
      class="m-4 p-4 bg-green-100 text-green-800 shadow itbms-message"
    >
      ✅ {{ successMessage }}
    </div>

    <div class="px-4 py-2">
      <div
        v-if="saleItems.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <SaleItemCard
          v-for="item in saleItems"
          :key="item.saleItemId"
          :item="item"
        />
      </div>
      <div v-else-if="loading" class="p-10 text-center text-gray-400 text-xl">
        Loading...
      </div>
      <div v-else class="p-10 text-center text-gray-400 text-xl">
        No sale item
      </div>
    </div>
  </div>
</template>
