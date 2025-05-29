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
  <div class="max-w-5xl mx-auto px-6 py-6">
    <div
      class="flex items-center justify-center space-x-6 text-xl font-medium text-neutral-700"
    >
      <button
        @click="router.back()"
        class="itbms-items-list transition-colors hover:text-blue-600 hover:underline underline-offset-4 cursor-pointer"
      >
        Sale Item List
      </button>

      <span class="text-neutral-400">/</span>

      <button
        @click="router.push({ path: 'brands/add' })"
        class="itbms-add-button transition-colors hover:text-blue-600 hover:underline underline-offset-4 cursor-pointer"
      >
        Add Brand
      </button>
    </div>

    <div v-if="flash.message" :class="flash.style" class="text-center mt-6">
      {{ flash.message }}
    </div>
    <BrandList v-if="brands.length !== 0" :items="brands" class="mt-8" />
  </div>
</template>

<style scoped></style>
