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
  <div class="min-h-screen bg-zinc-800 text-gray-900">
    <div class="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div
        class="bg-white border border-gray-200 rounded-2xl shadow-md px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Manage Brands</h1>
          <p class="text-sm text-gray-500 mt-1">
            View and maintain all available phone brands in the system
          </p>

          <!-- breadcrumb -->
          <div class="flex flex-wrap items-center text-sm text-gray-500 mt-3">
            <button
              @click="router.back()"
              class="hover:text-gray-800 hover:underline underline-offset-4 transition"
            >
              Sale Item List
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="router.push({ path: 'brands/add' })"
            class="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 hover:shadow transition"
          >
            + Add Brand
          </button>
        </div>
      </div>

      <!-- flash message -->
      <div v-if="flash.message" :class="flash.style" class="text-center mb-6">
        {{ flash.message }}
      </div>

      <!-- error -->
      <div
        v-if="errorMessage"
        class="text-center mb-6 text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-3"
      >
        {{ errorMessage }}
      </div>

      <!-- list -->
      <div v-if="brands.length !== 0">
        <BrandList :items="brands" />
      </div>

      <div
        v-else
        class="text-center text-gray-500 text-sm py-16 border border-dashed border-gray-300 rounded-xl bg-gray-50/50"
      >
        No brands found.
        <div class="text-gray-400 mt-1">
          Click “Add Brand” to create a new brand entry.
        </div>
      </div>
    </div>
  </div>
</template>
