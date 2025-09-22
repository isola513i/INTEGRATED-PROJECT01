<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { fetchSaleItems } from "@/services/saleItemService";
import SaleItemList from "@/components/product/SaleItemList.vue";
import ProductCarousel from "@/components/product/ProductCarousel.vue";
import PromoBar from "@/components/promo/PromoBar.vue";
import { useFlashStore } from "@/store/useFlashStore";

const saleItems = ref([]);
const loading = ref(true);
const router = useRouter();
const route = useRoute();

const flash = useFlashStore();

onMounted(async () => {
  const accessToken = localStorage.getItem('access_token')
  console.log(accessToken)
  if (route.query.successMessage) {
    successMessage.value = String(route.query.successMessage);
    setTimeout(() => {
      successMessage.value = "";
    }, 4000);
    router.replace({ query: {} });
  }

  try {
    const data = await fetchSaleItems();
    if (data) saleItems.value = data;
    else saleItems.value = [];
  } catch (err) {
    router.push("/server-error");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <PromoBar />
    <ProductCarousel />
    <div class="flex justify-between pt-10 py-2 mx-4">
      <div class="itbms-sale-item-add">
        <router-link
          to="/sale-items/add"
          class="px-6 py-2 bg-[#171717] text-white rounded-2xl hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 text-sm font-semibold"
        >
          Add New Sale Item
        </router-link>
      </div>
      <div class="itbms-manage-brand">
        <router-link
          to="/brands"
          class="px-6 py-2 bg-[#171717] text-white rounded-2xl hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 text-sm font-semibold"
        >
          Manage Brand
        </router-link>
      </div>
    </div>

    <div v-if="flash.message" :class="flash.style">
      {{ flash.message }}
    </div>
    <div
      v-if="saleItems.length === 0"
      class="itbms-no-sale-item p-10 text-center text-gray-400 text-xl"
    >
      No sale item
    </div>
    <SaleItemList v-if="saleItems.length > 0" :items="saleItems" />
  </div>
</template>

<style scoped></style>
