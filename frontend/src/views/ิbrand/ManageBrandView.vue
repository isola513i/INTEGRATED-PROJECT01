<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import BrandList from "@/components/brand/BrandList.vue";
import { fetchBrands } from "@/services/brandService";
import { useFlashStore } from "@/store/useFlashStore";

const router = useRouter();
const brands = ref([]);
const errorMessage = ref("");
const flash = useFlashStore();

onMounted(async () => {
  try {
    brands.value = await fetchBrands();
  } catch (error) {
    errorMessage.value = "Failed to load brands";
  }
});

if (flash.message === `Please add correct brand's name`) flash.message = "";
</script>

<template>
  <div class="p-2">
    <div>
      <button
        @click="router.back()"
        class="itbms-items-list text-blue-400 hover:text-blue-200 text-lg"
      >
        Sale Item List
      </button>
      <span class="text-blue-400"> > </span>
      <button
        @click="router.push({ path: 'brands/add' })"
        class="itbms-add-button text-blue-400 hover:text-blue-200 text-lg"
      >
        Add brand
      </button>
    </div>
    <div v-if="flash.message" :class="flash.style">
      {{ flash.message }}
    </div>
    <BrandList v-if="brands.length !== 0" :items="brands" />
  </div>
</template>

<style scoped></style>
